
export default (ss,...pp)=> [].concat(ss).map( (s,i)=> s + (i in pp ? pp[i] : '') ).join('')
