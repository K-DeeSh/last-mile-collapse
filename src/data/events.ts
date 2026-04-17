import { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  // ─── Автоматические события ───────────────────────────────────────────────
  {
    id: 'courier_optimization',
    title: 'Курьеры нашли оптимизацию',
    description: 'Курьеры придумали оптимизацию: не брать заказы, которые "слишком далеко". Мощность формально не изменилась.',
    delta: { backlog: +12, trust: -8 },
    weight: 2,
  },
  {
    id: 'algo_amsterdam',
    title: 'Обновление географии алгоритма',
    description: 'Алгоритм маршрутизации теперь считает, что Москва и Подольск "эмоционально рядом". Три маршрута проходят через промзону.',
    delta: { sla: -10, backlog: +8, capacity: -5 },
    weight: 1,
  },
  {
    id: 'warehouse_manual',
    title: 'Склад перешёл в ручной режим',
    description: 'Склад подтвердил: всё в порядке, работают в ручном режиме. Якобы так даже быстрее.',
    delta: { backlog: -8, energy: -10 },
    weight: 2,
  },
  {
    id: 'partner_integration',
    title: 'Статус интеграции: жива (наверное)',
    description: 'Партнёрское API вернуло HTTP 200, но тело ответа — JPEG кота. Инженеры разбираются.',
    delta: { capacity: -10, sla: -6 },
    weight: 1,
  },
  {
    id: 'sla_compliant',
    title: 'SLA формально соблюдён',
    description: 'SLA формально выполнен. Юристы подтвердили: доставка в 23:59 считается. Клиенты с этим не согласны.',
    delta: { trust: -10, sla: +5 },
    weight: 2,
  },
  {
    id: 'process_speed_hack',
    title: 'Скорость через отмену проверок',
    description: 'Команда доказала: любой процесс можно ускорить, если убрать всю валидацию. Скорость выросла. Корректность — это вайб.',
    delta: { capacity: +12, sla: -12, backlog: -5 },
    weight: 1,
  },
  {
    id: 'demand_spike',
    title: 'Неожиданный всплеск спроса',
    description: 'Лайфстайл-блогер написал про доставку "день в день". Заказов стало на 40% больше.',
    delta: { backlog: +20, capacity: -5 },
    weight: 2,
    minTurn: 3,
  },
  {
    id: 'courier_strike',
    title: 'Неформальная остановка работы',
    description: 'Курьеры "оценивают варианты" и "пересматривают условия занятости". Мощность 60% до разрешения.',
    delta: { capacity: -18, energy: +5, trust: -5 },
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'it_incident',
    title: 'IT-инцидент: Severity 2',
    description: 'Система диспетчеризации перезагрузилась в другом часовом поясе. Все ETAs теперь по UTC+11.',
    delta: { sla: -15, backlog: +10, energy: -8 },
    weight: 1,
    minTurn: 4,
  },
  {
    id: 'weather_bad',
    title: 'Погодное событие',
    description: 'Пошёл дождь. Не экстремальный. Просто дождь. Мощность упала на 20%, потому что никто не планировал осадки.',
    delta: { capacity: -12, backlog: +8, sla: -5 },
    weight: 2,
  },
  {
    id: 'viral_complaint',
    title: 'Жалоба стала вирусной',
    description: 'Клиент выложил фото доставки: коробка в хлам, адресована другому человеку. 40к лайков.',
    delta: { trust: -20, sla: -8 },
    weight: 1,
    minTurn: 6,
  },
  {
    id: 'seasonal_rush',
    title: 'Начинается сезонный пик',
    description: 'Каким-то образом этого не было в календаре. Бэклог будет расти быстрее ближайшие несколько ходов.',
    delta: { backlog: +15, cost: +8 },
    weight: 1,
    minTurn: 8,
  },
  {
    id: 'good_quarter',
    title: 'Неожиданно хороший квартал',
    description: 'Выручка растёт. Руководство отмечает успех, добавляя 25% к целевым объёмам. Немедленно.',
    delta: { backlog: +18, cost: +5, trust: +5 },
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'team_hero',
    title: 'Появился герой',
    description: 'Один курьер вручную обработал 60 доставок за день. Все похлопали. Он на больничном.',
    delta: { backlog: -12, energy: -15, capacity: -5 },
    weight: 1,
  },
  {
    id: 'mystery_backlog',
    title: 'Призрачные заказы',
    description: 'Сверка нашла 30 заказов в статусе "в пути" с прошлого квартала. Они были не в пути.',
    delta: { backlog: +14, trust: -8 },
    weight: 1,
    minTurn: 4,
  },
  {
    id: 'energy_drink_sponsor',
    title: 'Энергетики в офис',
    description: 'Маркетинг привёз 200 банок фирменного энергетика. Энергия команды взлетела. Сон — нет.',
    delta: { energy: +18, cost: +4 },
    weight: 2,
  },
  {
    id: 'cto_visit',
    title: 'CTO наблюдает за операциями',
    description: 'CTO провёл день в команде и оставил три страницы заметок под заголовком "Быстрые победы". Все уже устали.',
    delta: { energy: -10, sla: +8, capacity: +5 },
    weight: 1,
    minTurn: 3,
  },
  {
    id: 'algorithm_update',
    title: 'Алгоритм маршрутизации v2.1',
    description: 'Новый алгоритм быстрее и на 12% эффективнее в симуляции. В проде строит маршруты через промзону.',
    delta: { capacity: +10, sla: -10, backlog: +5 },
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'positive_review',
    title: 'Неожиданно хороший отзыв',
    description: 'Клиент получил посылку с рукописной запиской и стикером. Оставил 5 звёзд. Никто не знает, кто написал записку.',
    delta: { trust: +15 },
    weight: 2,
  },
  {
    id: 'competitor_collapse',
    title: 'Конкурент упал',
    description: 'Система конкурента рухнула. Их клиенты теперь твои. Объём +30%.',
    delta: { backlog: +20, trust: +8, cost: +5 },
    weight: 1,
    minTurn: 6,
  },
  {
    id: 'excel_dashboard',
    title: 'Руководство просит дашборд',
    description: 'Новый Excel-дашборд в реальном времени теперь обязателен на каждой смене. Рассылка руководству каждые 15 минут.',
    delta: { energy: -12, cost: +6, sla: +4 },
    weight: 1,
    minTurn: 3,
  },
  {
    id: 'fuel_price',
    title: 'Рост цен на топливо',
    description: 'Стоимость топлива выросла на 18%. Курьеры посчитали. Некоторые маршруты больше не имеют экономического смысла.',
    delta: { cost: +15, capacity: -8 },
    weight: 2,
  },
  {
    id: 'new_client',
    title: 'Подключён корпоративный клиент',
    description: 'Продажи подписали крупного клиента. Закупки: 2000 заказов/день. Операции узнали из Slack.',
    delta: { backlog: +22, cost: +8, trust: +5 },
    weight: 1,
    minTurn: 7,
  },
  {
    id: 'regulatory_audit',
    title: 'Объявлена проверка регулятора',
    description: 'Регулятор проверяет соблюдение SLA за последние 90 дней. Бухгалтерия "пересматривает методологию".',
    delta: { sla: +10, energy: -15, cost: +10 },
    weight: 1,
    minTurn: 8,
  },
  {
    id: 'holiday',
    title: 'Внеплановый выходной',
    description: 'Оказывается, сегодня выходной в трёх регионах курьеров. Календарь говорил обратное.',
    delta: { capacity: -15, backlog: +10 },
    weight: 2,
  },

  // ─── События с выбором ────────────────────────────────────────────────────
  {
    id: 'courier_union',
    title: 'Курьеры объединяются',
    description: 'Курьеры организуются. Хотят либо лучшую оплату, либо короткие смены. Как реагируешь?',
    choices: [
      {
        label: 'Принять требования',
        delta: { cost: +15, energy: +15, capacity: +8 },
        consequence: 'Доброжелательность куплена. Мощность и энергия восстанавливаются.',
      },
      {
        label: 'Тянуть резину',
        delta: { energy: -10, trust: -8 },
        consequence: 'В чате становится громче. Ничего не решено.',
      },
      {
        label: 'Нанять замену',
        delta: { capacity: -10, cost: +10, sla: -8 },
        consequence: 'Замена нанята. Онбординг займёт время. Качество просядет.',
      },
    ],
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'client_escalation',
    title: 'Эскалация ключевого клиента',
    description: 'Крупнейший клиент позвонил. Последние 10 заказов опоздали. Требует объяснений.',
    choices: [
      {
        label: 'Извиниться + компенсация',
        delta: { trust: +12, cost: +12 },
        consequence: 'Клиент успокоен. Компенсация бьёт по бюджету.',
      },
      {
        label: 'Свалить на партнёра',
        delta: { trust: -8, sla: -5 },
        consequence: 'Клиент не убеждён. В копии — его юрист.',
      },
      {
        label: 'Выделить личного курьера',
        delta: { trust: +15, capacity: -8, cost: +10 },
        consequence: 'Клиент доволен. У остальных теперь одним курьером меньше.',
      },
    ],
    weight: 1,
    minTurn: 4,
  },
  {
    id: 'leadership_review',
    title: 'Квартальный бизнес-ревью',
    description: 'Руководство хочет посмотреть на цифры. Можно показать честные или оптимистичные.',
    choices: [
      {
        label: 'Честные данные',
        delta: { trust: +8, energy: -8, sla: +5 },
        consequence: 'Уважают. Дали ресурсы. И больше контроля.',
      },
      {
        label: 'Оптимистичный спин',
        delta: { cost: +10, energy: +5, trust: -5 },
        consequence: 'Цели подняты. Руководство в восторге.',
      },
      {
        label: 'Перенести ревью',
        delta: { energy: +8 },
        consequence: 'Выиграл один ход. Спросят на следующем.',
      },
    ],
    weight: 1,
    minTurn: 6,
  },
  {
    id: 'tech_offer',
    title: 'Питч новой платформы',
    description: 'Стартап презентует "диспетчерскую ОС нового поколения". Стоит денег и требует интеграции.',
    choices: [
      {
        label: 'Запустить пилот сейчас',
        delta: { cost: +12, capacity: +5, energy: -8 },
        consequence: 'Пилот запущен. 60% функций работает в первый день.',
      },
      {
        label: 'Отложить на следующий квартал',
        delta: { energy: +5 },
        consequence: 'Ничего не меняется. Стартап пишет еженедельно.',
      },
      {
        label: 'Вежливо отказать',
        delta: { cost: -5, energy: +3 },
        consequence: 'Бюджет сохранён. Стартап написал об этом в LinkedIn.',
      },
    ],
    weight: 1,
    minTurn: 3,
  },
  {
    id: 'budget_freeze',
    title: 'Финансы объявляют заморозку',
    description: 'Нет новых найма, нет дискреционных расходов. Финансы прислали очень строгое письмо.',
    choices: [
      {
        label: 'Полностью соблюдать',
        delta: { cost: -15, capacity: -10, energy: -5 },
        consequence: 'Бюджет сохранён. Мощность страдает.',
      },
      {
        label: 'Обойти через смежный бюджет',
        delta: { cost: +5, capacity: +5 },
        consequence: 'Проблема решена. Финансы узнают в конце квартала.',
      },
      {
        label: 'Эскалировать к CEO',
        delta: { energy: -10, cost: -5, sla: +5 },
        consequence: 'Исключение получено. Политический капитал потрачен.',
      },
    ],
    weight: 1,
    minTurn: 5,
  },
  {
    id: 'press_inquiry',
    title: 'Запрос от журналиста',
    description: 'Журналист пишет про последнюю милю. У него есть данные о задержках доставки.',
    choices: [
      {
        label: 'Сотрудничать и быть честным',
        delta: { trust: +10, sla: -5 },
        consequence: 'Статья сбалансирована. Одна цитата вырвана из контекста.',
      },
      {
        label: 'Без комментариев',
        delta: { trust: -8 },
        consequence: 'Статья вышла без ответа компании. "Комментарии не поступили."',
      },
      {
        label: 'Организовать экскурсию',
        delta: { trust: +8, energy: -8, cost: +5 },
        consequence: 'Опубликован позитивный материал. Операции потеряли два дня.',
      },
    ],
    weight: 1,
    minTurn: 6,
  },
];

export function getRandomEvent(
  turn: number,
  usedEventIds: Set<string>
): GameEvent | null {
  const eligible = EVENTS.filter(
    e => (!e.minTurn || e.minTurn <= turn) && !usedEventIds.has(e.id)
  );
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let rand = Math.random() * totalWeight;
  for (const event of eligible) {
    rand -= event.weight ?? 1;
    if (rand <= 0) return event;
  }
  return eligible[eligible.length - 1];
}
