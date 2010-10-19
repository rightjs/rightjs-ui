/**
 * RightJS UI Internationalization: Brazilian portuguese module
 *
 * Copyright (C) Bruno Malvestuto
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Feito',
    Now:            'Agora',
    NextMonth:      'Próximo Mês',
    PrevMonth:      'Mês Anterior',
    NextYear:       'Próximo ano',
    PrevYear:       'Ano anterior',

    dayNames:        $w('Domingo Segunda Terça Quarta Quinta Sexta Sábado'),
    dayNamesShort:   $w('Dom Seg Ter Qua Qui Sex Sáb'),
    dayNamesMin:     $w('D S T Q Q S S'),
    monthNames:      $w('Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro'),
    monthNamesShort: $w('Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Fechar',
    Prev:  'Anterior',
    Next:  'Próxima'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Salvar",
    Cancel: "Cancelar"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Feito'
  });
}

if (self.Dialog) {
  $ext(Dialog.i18n, {
    Ok:       'Ok',
    Close:    'Fechar',
    Cancel:   'Cancelar',
    Help:     'Ajuda',
    Expand:   'Maximizar',
    Collapse: 'Minimizar',

    Alert:    'Atenção!',
    Confirm:  'Confirmar',
    Prompt:   'Editar'    
  });
}
