import config from './config.js'

const DEBUG = /debug/.test( location.search )
const log = DEBUG
        ? ss=> (...a)=> console.log( ss.join(''), ...a) || a[0]
        : ss=> o=>o

var $container

const init = ()=> {
	$container = document.querySelector( config.container )
	loadPage( $container.textContent ? $container.textContent : ''+document.location, ''+document.location )
}

const loadPage = ( url, href = url )=>
	fetch( url.slice(-1) == '/' ? url+'index.md' : url+'.md' )
		.then( res=> res.text() )
		.then( src=> ({ href, title: `MDocs - ${url}`, url, src }) )
		.then( ({ href, title, url, src })=> {
			history.pushState( { href, title, url, src }, title, href )
			onpopstate({ state: { href, title, url, src } })
		})

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
	$container.innerHTML = e.state.src
}

window.addEventListener( "load", init, false )
Object.assign( window, {
	loadPage,
	init
})
