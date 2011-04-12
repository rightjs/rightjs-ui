/**
 * RightJS UI Internationalization: Brazilian portuguese module
 *
 * Copyright (C) Bruno Malvestuto
 */
RightJS.Object.each({

  Calendar: {
    Done:           'Feito',
    Now:            'Agora',
    NextMonth:      'Próximo Mês',
    PrevMonth:      'Mês Anterior',
    NextYear:       'Próximo ano',
    PrevYear:       'Ano anterior',

    dayNames:        'Domingo Segunda Terça Quarta Quinta Sexta Sábado'.split(' '),
    dayNamesShort:   'Dom Seg Ter Qua Qui Sex Sáb'.split(' '),
    dayNamesMin:     'D S T Q Q S S'.split(' '),
    monthNames:      'Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro'.split(' '),
    monthNamesShort: 'Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez'.split(' ')
  },

  Lightbox: {
    Close: 'Fechar',
    Prev:  'Anterior',
    Next:  'Próxima'
  },

  InEdit: {
    Save:   "Salvar",
    Cancel: "Cancelar"
  },

  Colorpicker: {
    Done: 'Feito'
  },

  Dialog: {
    Ok:       'Ok',
    Close:    'Fechar',
    Cancel:   'Cancelar',
    Help:     'Ajuda',
    Expand:   'Maximizar',
    Collapse: 'Minimizar',

    Alert:    'Atenção!',
    Confirm:  'Confirmar',
    Prompt:   'Editar'
  }

}, function(module, i18n) {
  if (self[module]) {
    RightJS.$ext(self[module].i18n, i18n);
  }
});