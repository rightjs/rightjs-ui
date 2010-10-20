/**
 * RightJS UI Internationalization: Japanese module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.Options, {
    format:   'POSIX'
  });

  $ext(Calendar.i18n, {
    Done:           'Done',
    Now:            '今日',
    NextMonth:      '翌月',
    PrevMonth:      '前の月',
    NextYear:       '翌年',
    PrevYear:       '前年',

    dayNames:        $w('日曜日 月曜日 火曜日 水曜日 木曜日 金曜日 土曜日'),
    dayNamesShort:   $w('日 月 火 水 木 金 土'),
    dayNamesMin:     $w('日 月 火 水 木 金 土'),
    monthNames:      $w('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月'),
    monthNamesShort: $w('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: '閉じる',
    Prev:  '前の画像',
    Next:  '次の画像'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "保存",
    Cancel: "キャンセル"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Done'
  });
}

if (self.Dialog) {
  $ext(Dialog.i18n, {
    Ok:       'Ok',
    Close:    'Close',
    Cancel:   'Cancel',
    Help:     'Help',
    Expand:   'Expand',
    Collapse: 'Collapse',

    Alert:    'Warning!',
    Confirm:  'Confirm',
    Prompt:   'Enter'
  })
}

