export const tableLables = {
// Root
    noRowsLabel: 'Нет данных для отображения',
    noResultsOverlayLabel: 'Результаты не найдены.',

    // Density selector toolbar button text
    toolbarDensity: 'Плотность',
    toolbarDensityLabel: 'Плотность',
    toolbarDensityCompact: 'Компактная',
    toolbarDensityStandard: 'Стандартная',
    toolbarDensityComfortable: 'Широкая',

    // Columns selector toolbar button text
    toolbarColumns: 'Колонки',
    toolbarColumnsLabel: 'Выберите колонки',

    // Filters toolbar button text
    toolbarFilters: 'Фильтры',
    toolbarFiltersLabel: 'Показать фильтры',
    toolbarFiltersTooltipHide: 'Скрыть фильтры',
    toolbarFiltersTooltipShow: 'Показать фильтры',
    toolbarFiltersTooltipActive: (count: number) =>
        count !== 1 ? `${count} активных фильтров` : `${count} активный фильтр`,

    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Поиск…',
    toolbarQuickFilterLabel: 'Поиск',
    toolbarQuickFilterDeleteIconLabel: 'Очистить',

    // Export selector toolbar button text
    toolbarExport: 'Экспорт',
    toolbarExportLabel: 'Экспорт',
    toolbarExportCSV: 'Скачать в формате CSV',
    toolbarExportPrint: 'Печать',
    toolbarExportExcel: 'Скачать в формате Excel',

    // Columns management text
    columnsManagementSearchTitle: 'Поиск',
    columnsManagementNoColumns: 'Нет колонок',
    columnsManagementShowHideAllText: 'Показать/Скрыть все',
    columnsManagementReset: 'Сбросить',

    // Filter panel text
    filterPanelAddFilter: 'Добавить фильтр',
    filterPanelRemoveAll: 'Удалить все',
    filterPanelDeleteIconLabel: 'Удалить',
    filterPanelLogicOperator: 'Логический оператор',
    filterPanelOperator: 'Оператор',
    filterPanelOperatorAnd: 'И',
    filterPanelOperatorOr: 'ИЛИ',
    filterPanelColumns: 'Колонки',
    filterPanelInputLabel: 'Значение',
    filterPanelInputPlaceholder: 'Значение фильтра',

    // Filter operators text
    filterOperatorContains: 'содержит',
    filterOperatorDoesNotContain: 'не содержит',
    filterOperatorEquals: 'равно',
    filterOperatorDoesNotEqual: 'не равно',
    filterOperatorStartsWith: 'начинается с',
    filterOperatorEndsWith: 'заканчивается на',
    filterOperatorIs: 'это',
    filterOperatorNot: 'не это',
    filterOperatorAfter: 'после',
    filterOperatorOnOrAfter: 'в или после',
    filterOperatorBefore: 'до',
    filterOperatorOnOrBefore: 'в или до',
    filterOperatorIsEmpty: 'пусто',
    filterOperatorIsNotEmpty: 'не пусто',
    filterOperatorIsAnyOf: 'любой из',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',

    // Header filter operators text
    headerFilterOperatorContains: 'Содержит',
    headerFilterOperatorDoesNotContain: 'Не содержит',
    headerFilterOperatorEquals: 'Равно',
    headerFilterOperatorDoesNotEqual: 'Не равно',
    headerFilterOperatorStartsWith: 'Начинается с',
    headerFilterOperatorEndsWith: 'Заканчивается на',
    headerFilterOperatorIs: 'Это',
    headerFilterOperatorNot: 'Не это',
    headerFilterOperatorAfter: 'После',
    headerFilterOperatorOnOrAfter: 'В или после',
    headerFilterOperatorBefore: 'До',
    headerFilterOperatorOnOrBefore: 'В или до',
    headerFilterOperatorIsEmpty: 'Пусто',
    headerFilterOperatorIsNotEmpty: 'Не пусто',
    headerFilterOperatorIsAnyOf: 'Любой из',
    'headerFilterOperator=': 'Равно',
    'headerFilterOperator!=': 'Не равно',
    'headerFilterOperator>': 'Больше чем',
    'headerFilterOperator>=': 'Больше или равно',
    'headerFilterOperator<': 'Меньше чем',
    'headerFilterOperator<=': 'Меньше или равно',

    // Filter values text
    filterValueAny: 'любой',
    filterValueTrue: 'да',
    filterValueFalse: 'нет',

    // Column menu text
    columnMenuLabel: 'Меню',
    columnMenuShowColumns: 'Показать колонки',
    columnMenuManageColumns: 'Управление колонками',
    columnMenuFilter: 'Фильтр',
    columnMenuHideColumn: 'Скрыть колонку',
    columnMenuUnsort: 'Сбросить сортировку',
    columnMenuSortAsc: 'Сортировать по возрастанию',
    columnMenuSortDesc: 'Сортировать по убыванию',

    // Column header text
    columnHeaderFiltersTooltipActive: (count: number) =>
        count !== 1 ? `${count} активных фильтров` : `${count} активный фильтр`,
    columnHeaderFiltersLabel: 'Показать фильтры',
    columnHeaderSortIconLabel: 'Сортировка',

    // Rows selected footer text
    footerRowSelected: (count: number) =>
        count !== 1
            ? `${count.toLocaleString()} строк выбрано`
            : `${count.toLocaleString()} строка выбрана`,

    // Total row amount footer text
    footerTotalRows: 'Всего строк:',

    // Total visible row amount footer text
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
        `${visibleCount.toLocaleString()} из ${totalCount.toLocaleString()}`,

    // Checkbox selection text
    checkboxSelectionHeaderName: 'Выбор чекбокса',
    checkboxSelectionSelectAllRows: 'Выбрать все строки',
    checkboxSelectionUnselectAllRows: 'Снять выбор со всех строк',
    checkboxSelectionSelectRow: 'Выбрать строку',
    checkboxSelectionUnselectRow: 'Снять выбор со строки',

    // Boolean cell text
    booleanCellTrueLabel: 'да',
    booleanCellFalseLabel: 'нет',

    // Actions cell more text
    actionsCellMore: 'ещё',

    // Column pinning text
    pinToLeft: 'Закрепить слева',
    pinToRight: 'Закрепить справа',
    unpin: 'Открепить',

    // Tree Data
    treeDataGroupingHeaderName: 'Группировка',
    treeDataExpand: 'показать дочерние',
    treeDataCollapse: 'скрыть дочерние',

    // Grouping columns
    groupingColumnHeaderName: 'Группировка',
    groupColumn: (name: string) => `Группировать по ${name}`,
    unGroupColumn: (name: string) => `Отменить группировку по ${name}`,

    // Master/detail
    detailPanelToggle: 'Переключение панели деталей',
    expandDetailPanel: 'Развернуть',
    collapseDetailPanel: 'Свернуть',

    // Used core components translation keys
    MuiTablePagination: {
        labelRowsPerPage: 'Строк на странице:',
    },

    // Row reordering text
    rowReorderingHeaderName: 'Изменение порядка строк',

    // Aggregation
    aggregationMenuItemHeader: 'Агрегация',
    aggregationFunctionLabelSum: 'сумма',
    aggregationFunctionLabelAvg: 'среднее',
    aggregationFunctionLabelMin: 'мин',
    aggregationFunctionLabelMax: 'макс',
    aggregationFunctionLabelSize: 'размер',
};
