/**
 * Special character picking tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Symbol = new Class(Rte.Tool, {
  extend: {
    CHARS:
      // basic
      'nbsp amp quot prime Prime lsaquo rsaquo laquo raquo ' +
      'lsquo rsquo ldquo rdquo sbquo bdquo ' +

      // trademakrs
      'cent euro pound yen copy reg trade ' +

      // text things
      'permil middot bull hellip sect para szlig ' +

      // mathematics
      'lt gt le ge ndash mdash macr oline curren brvbar uml '    +
      'iexcl iquest circ tilde deg minus plusmn divide frasl '   +
      'times sup1 sup2 sup3 frac14 frac12 frac34 fnof int sum '  +
      'infin radic sim cong asymp ne equiv isin notin ni prod '  +
      'and or not cap cup part forall exist empty nabla lowast ' +
      'prop ang acute cedil ordf ordm dagger Dagger ' +

      // greek symbols
      'Alpha Beta Gamma Delta Epsilon Zeta Eta Theta Iota Kappa '   +
      'Lambda Mu Nu Xi Omicron Pi Rho Sigma Tau Upsilon Phi Chi '   +
      'Psi Omega alpha beta gamma delta  epsilon zeta eta theta '   +
      'iota kappa lambda mu nu xi omicron pi rho sigmaf sigma tau ' +
      'upsilon phi chi psi omega ' +

      // euro symbols
      'Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave '    +
      'Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve ' +
      'Oacute Ocirc Otilde Ouml Oslash OElig Scaron Ugrave Uacute '   +
      'Ucirc Uuml Yacute Yuml THORN agrave aacute acirc atilde auml ' +
      'aring aelig ccedil egrave eacute ecirc euml igrave iacute '    +
      'icirc iuml eth ntilde ograve oacute ocirc otilde ouml oslash ' +
      'oelig scaron ugrave uacute ucirc uuml yacute thorn yuml '      +

      // all sorts of other things
      'alefsym piv real thetasym upsih weierp image larr uarr rarr '   +
      'darr harr crarr lArr uArr rArr dArr hArr there4 sub sup nsub '  +
      'sube supe oplus otimes perp sdot lceil rceil lfloor rfloor '    +
      'lang rang loz spades clubs hearts diams ensp emsp thinsp zwnj ' +
      'zwj lrm rlm shy'
  }
});