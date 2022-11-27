
/* Node shortcuts */

import merge from '../String/merge.js'

// from dev/Elliott.ist/waves.svg/DOM.js
Node.prototype.$ = function( ...args )
{
	return this.querySelector( merge(...args) )
}
Node.prototype.$$ = function( ...args )
{
	return [...this.querySelectorAll( merge(...args) )]
}
Node.prototype.add = function( ...args )
{
	this.append( ...args )
	return this
}
// end from dev/Elliott.ist/waves.svg/DOM.js
