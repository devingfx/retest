export default {
	root: '/',
	container: 'body',
// 	load: url=> url.replace( /\.html$/, '.md' )
	load: url=> url.replace( /\/$/, '.md' )
}
