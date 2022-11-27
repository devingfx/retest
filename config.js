export default {
	root: '/',
	container: 'body',
// 	locate: href=> href.slice(-1) == '/' ? href+'index.md' : href+'.md'
// 	locate: href=> href.replace( /\.html$/, '.md' )
	locate: href=> href.replace( /\/$/, '.md' )
}
