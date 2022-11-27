// import { $, $$, HTML } from 'vanill.es/DOM_.js'
import YAML from './vanill.es/String/YAML.js'
import MD from './vanill.es/String/MD.js'

import config from './config.js'

const DEBUG = /debug/.test( location.search )
const log = DEBUG
        ? ss=> (...a)=> console.log( ss.join(''), ...a) || a[0]
        : ss=> o=>o

var $container

const init = async ()=> {
	
	await YAML.import()
	await MD.import({
		html: true,
		linkify: true,
		typographer: true,
		highlight,	//@see https://markdown-it.github.io/markdown-it/#MarkdownIt
		addons: {
			markdownitFrontMatter: 'https://unpkg.com/markdown-it-front-matter@0.2.3/index.js',
			markdownitDecorate: 'https://unpkg.com/markdown-it-decorate@1.2.2/index.js'
		}
	})
	.then( md=>md
		.use( md.options.addons.markdownitFrontMatter, fm=> MD.onFrontMatter(YAML(fm)) )
		.use( md.options.addons.markdownitDecorate )
	)
	
	let styles
	document.head.append( styles = document.createElement('link') )
	styles.rel = "stylesheet"
	styles.href = "./spa.css"
	$container = document.querySelector( config.container )
	loadPage( ''+document.location )//, !!$container.textContent && $container.textContent )
}

MD.onFrontMatter = fm=> console.log(fm) // override this


// MD.onFrontMatter = fm=> {
// 	console.log( 'onFrontMatter:', fm )
// 	if( !fm ) // no front matter > cleanup
// 	{
// 		$main.previousElementSibling?.matches('.hero')
// 			&& $main.previousElementSibling.remove()
// 		return
// 	}
// 	if( fm.hero )
// 	{
// 		$main.previousElementSibling?.matches('.hero')
// 			&& $main.previousElementSibling.remove()
// 		$main.addHTMLBefore( Hero(fm.hero) )
// 	}
// }

const loadPage = ( href, _url = href, url = config.locate(href) )=>
// 	fetch( url.slice(-1) == '/' ? url+'index.md' : url+'.md' )
	fetch( url )
		.then( res=> res.text() )
		.then( src=> ({ href, title: `MDocs - ${url}`, url, src }) )
		.then( state=> {
			history.pushState( state, state.title, state.href )
			onpopstate({ state })
		})


const highlight = ( str, lang )=> {

	const escapeHTML = html=> new Option(html).innerHTML
	const dom2hl = n=> 
			n.nodeType == n.ELEMENT_NODE
				? `<el><tag>${n.localName}</tag>${
						[...n.attributes]
							.map( att=> `<att>${att.name}${att.value!==''?`<v>${att.value}</v>`:''}</att>`).join('')
					}</el>${
						[...n.childNodes].map(dom2hl).join('')
				}<el><tag>/${n.localName}</tag></el>`
			:n.nodeType == n.TEXT_NODE
				? `<text>${n.parentNode.localName == 'script' ? `<code js highlighted>${js2hl(n.textContent)}</code>` : escapeHTML(n.textContent)}</text>`
			:n.nodeType == n.COMMENT_NODE
				? `<comment>${escapeHTML(n.textContent)}</comment>`
			:''
	,	parseHTML = str=> {let t = document.createElement('template'); t.innerHTML = str; return t.content.childNodes }
	,	js2hl = s=> {
			const tokens = {
				keyword: 'import export from const let var class extends return typeof instanceof in do as new of'.split(' ').map( s=> new RegExp('\\b'+s+'\\b','g') )
			,	function: 'function \\=\\> async await'.split(' ').map( s=> new RegExp(s,'g') )
			,	intrinsic: 'undefined null NaN true false'.split(' ').map( s=> new RegExp(s,'g') )
			,	token: '\\{ \\} \\( \\) \\[ \\] ,'.split(' ').map( s=> new RegExp(s,'g') )
			,	string: `' " \``.split(' ').reverse().map( s=> new RegExp(s+'(.*?)'+s,'gs') )
			,	number: [ /(?<![˻˺]\d*)\d[\d\.]?/g ]
			,	comment: [ /\/\*(.*?)\*\//gs, /\/\/(.*)/g ]
			}
			const strings = [], comments = []
			s = tokens.string.reduce( (s,tok)=> s.replace(tok,s=>'˻'+(strings.push(s)-1)+'˺'), s )
			s = tokens.comment.reduce( (s,tok)=> s.replace(tok,s=>'˺'+(comments.push(s)-1)+'˻'), s )
			//console.log(strings,s)
			s = tokens.token.reduce( (s,tok)=> s.replace(tok,s=> `<token t="${s}">${s}</token>`), s )
			s = tokens.keyword.reduce( (s,tok)=> s.replace(tok,s=> `<keyword t="${s}">${s}</keyword>`), s )
			s = tokens.function.reduce( (s,tok)=> s.replace(tok,s=> `<function t="${s}">${s}</function>`), s )
			s = tokens.intrinsic.reduce( (s,tok)=> s.replace(tok,s=> `<intrinsic t="${s}">${s}</intrinsic>`), s )
			s = tokens.number.reduce( (s,tok)=> s.replace(tok,s=> `<intrinsic t="number">${s}</intrinsic>`), s )
			s = s.replace(/˻(\d+)˺/g, (s,i)=> `<string t="${strings[i][0]}">${strings[i][0] == '`' ? `<code html highlighted>${[...parseHTML(strings[i])].map(dom2hl).join('')}</code>` : escapeHTML(strings[i])}</string>` )
			s = s.replace(/˺(\d+)˻/g, (s,i)=> `<comment>${escapeHTML(comments[i])}</comment>` )

			return s
		}

// 	requestAnimationFrame(addCodeCopyButton)

	return lang == 'html'
			? `<pre><code html highlighted>${ [...parseHTML(str)].map(dom2hl).join('') }</code></pre>`
		: lang == 'javascript' || lang == 'js'
			? `<pre><code js highlighted>${ js2hl(str) }</code></pre>`
		: ''

}

document.addEventListener('click', e=> {
	const target = e.target instanceof HTMLAnchorElement ? e.target : e.target.closest('a[href]')
	if( !target ) return true

	const isInternal = ( new URL(target.href) ).origin == location.origin
	console.log( e.target, target, target.href, isInternal )
	if( !isInternal ) return true
	e.preventDefault()
	loadPage( target.href )
	return false
})
window.onpopstate = e=> {
	document.title = e.state.title
	$container.innerHTML = MD( e.state.src )
}

window.addEventListener( "load", init, false )
Object.assign( window, {
	loadPage,
	init,
	MD
})
