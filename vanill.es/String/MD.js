import merge from "./merge.js"


/**
 * Tried several markdown implementation:
 * 
 * - [markdown-js](https://github.com/evilstreak/markdown-js) >> Unmaintained
 * - [showdown](https://github.com/showdownjs/showdown) >> Not esm loadable
 * - [showdown](https://showdownjs.com/docs/quickstart/) >> 
 * - [marked](https://marked.js.org/) https://github.com/markedjs/marked
 * - [turndown](https://www.npmjs.com/package/turndown) >> Not working
 * - [markdown-it](https://github.com/markdown-it/markdown-it) >> OK!
 * 
 * Finally selected **markdown-it** that is esm loadable and configurable with plugins!
 * @see https://markdown-it.github.io/markdown-it/#MarkdownIt
 * @see https://spec.commonmark.org/0.30/
 * 
 * Tested plugins:
 * - https://unpkg.com/markdown-it-front-matter@0.2.3/index.js
 *     - https://github.com/parksb/markdown-it-front-matter
 * - https://unpkg.com/markdown-it-container@3.0.0/dist/markdown-it-container.min.js
 * - https://unpkg.com/markdown-it-decorate@1.2.2/index.js
 *     - https://github.com/rstacruz/markdown-it-decorate
 * 
 * 
 * 
 * More plugins:
 * @see https://www.jsdelivr.com/?query=markdown-it
 * @see https://cdnjs.com/libraries?q=markdown-it
 */

/**@deprecated */
const importScript = url=> {
	document.head.insertAdjacentHTML('beforeend',
	`<script src="${url}"></script>`)
}


const importCorrected = ( url, id )=>
	fetch( url ).then( res=> res.text() )
		.then( js=> '(function(){'+js.replace(/module.exports/,'window.'+id)+'})()' )
		.then( eval )


/*
const MD = (...a)=> MD.parse( merge(...a) )
// MD.stringify = obj=> new TurndownService().turndown( obj )
MD.parse = str=> new showdown.Converter().makeHtml( str )
MD.import = ()=> 
	importScript('https://unpkg.com/showdown/dist/showdown.min.js') //marche pas
	// import('https://unpkg.com/showdown/dist/showdown.min.js')
	// import('https://cdn.jsdelivr.net/npm/showdown@latest/dist/showdown.min.js')
	// import('https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js')
// ,	import('https://unpkg.com/turndown/lib/turndown.browser.umd.js') //marche pas
*/
	
const MD = (...a)=> MD.parse( merge(...a) )
MD.i = (...a)=> MD.parseInline( merge(...a) )
// MD.stringify = obj=> new TurndownService().turndown( obj )
MD.parse = str=> MD._parser.render( str )
MD.parseInline = str=> MD._parser.renderInline( str )
MD.import = ( options )=> 
	import('https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js')
		.then( ()=>{
			MD._parser = window.markdownit( options )
			if( options.addons )
				return Promise.all(
							Object.entries( options.addons )
								.map( ([name,url])=> importCorrected(url,name) )
						)
						.then( ()=> {
							Object.keys( options.addons )
								.map( name=> MD._parser.options.addons[name] = window[name] )
							return MD._parser
						})
			return MD._parser
		})
// ,	import('https://unpkg.com/turndown/lib/turndown.browser.umd.js') //marche pas



export default MD
