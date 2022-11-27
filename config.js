export default {
	root: '/retest/',
	container: 'body',
	locate: href=> href.slice(-1) == '/' ? href+'index.md' : href+'.md'
// 	locate: href=> href.replace( /\.html$/, '.md' )
// 	locate: href=> href.replace( /\/$/, '.md' )
}
/*
no ext and no /:
canonical		real			data
/			/index.html		/index.md
/page1			/page1.html		/page1.md
/page2			/page2.html		/page2.md
/dir/			/dir/index.html		/dir/index.md
/dir/subpage		/dir/subpage.html	/dir/subpage.md


no ext and /:
canonical		real			data
/			/index.html		/index.md
/page1/			/page1/index.html	/page1.md
/page2/			/page2/index.html	/page2.md
/dir/			/dir/index.html		/dir.md
/dir/subpage/		/dir/subpage/index.html	/dir/subpage.md


ext and / dir:
canonical		real			data
/			/index.html		/index.md
/page1.html		/page1.html		/page1.md
/page2.html		/page2.html		/page2.md
/dir/			/dir/index.html		/dir.md		/dir/index.md
/dir/subpage.html	/dir/subpage.html	/dir/subpage.md

*/
