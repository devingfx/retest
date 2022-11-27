export default {
	root: '/',
	container: 'body',
// 	locate: href=> href.slice(-1) == '/' ? href+'index.md' : href+'.md'
// 	locate: url=> url.replace( /\.html$/, '.md' )
	locate: url=> url.replace( /\/$/, '.md' )
}
