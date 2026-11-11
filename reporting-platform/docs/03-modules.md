# 03. Каталог модулей и границы

| Module ID | Владелец/ответственность | Публичные сервисы/операции | Зависимости |
| --- | --- | --- | --- |
| `identity` | пользователи/группы/профили | `getActor`, `resolveMemberships` | identity-adapter |
| `authorization` | RBAC/ABAC, policy decision | `can(actor, action, resource)` | identity, org-structure |
| `org-structure` | отделы и исторические структуры | `getUnitAt(date)`, `listUnits` | database |
| `recipients` | государственные органы и адресаты | `listRecipients` | database |
| `catalog` | отчётные виды и правила | `getRegulationVersion` | recipients |
| `indicators` | словарь показателей и семантика | `getDefinition`, `validateUnit` | catalog |
| `forms` | схемы форм, публикация версий | `publishTemplate`, `getTemplateVersion` | indicators |
| `campaigns` | периоды, расписание, запуск сбора | `openCampaign`, `closeCampaign` | forms, org-structure, queue |
| `assignments` | задания на отчёт | `assign`, `overdue`, `reassign` | campaigns, authz |
| `submissions` | черновики, сдача, версии | `saveDraft`, `submit`, `getVersion` | forms, authz, audit |
| `approvals` | проверка/замечания/решения | `requestChanges`, `approve` | submissions, audit |
| `metrics` | подтверждённые значения и provenance | `deriveSnapshot` | indicators, approvals |
| `aggregation` | правила и снимки сводов | `buildConsolidation` | metrics, catalog |
| `documents` | шаблоны и итоговые файлы | `renderDocument`, `freezeDocument` | aggregation, file-store |
| `notifications` | события/уведомления | `notify`, `scheduleReminder` | queue |
| `audit` | неизменяемый журнал действий | `append` | database |
| `integrations` | Pulse, 1C, внешние API | `publishEvent`, `importData` | outbox, authz |

**Код-плагины !== виды отчётов.** Новый вид отчётности, форма, получатель или подразделение — запись в конфигурационных таблицах с версионированием. Не создавать для каждого отчёта новый npm-пакет.

## Правила зависимостей
1. HTTP-эндпоинты обращаются к application services, а не напрямую к SQL.
2. Отчётный шаблон не хранит исполняемый JavaScript.
3. Интерфейс — внешний клиент API, не зависит от Cordis в браузере.
4. Внешние адаптеры зависят от контрактов, а не от внутренних таблиц.
5. Хранение бинарных вложений — через file-store (локальная FS/S3-совместимое хранилище on-prem), метаданные — в PostgreSQL.

## Контракт плагина (предложение)
- `name`, `version`, `apiVersion`, `capabilities`, `requires`, `configSchema`.
- Этапы: register → validate → start → ready → graceful stop.
- Потребитель проверяет доступность capability и совместимость контракта.
- Интеграционные события версионируются: `report.submitted.v1`, `report.approved.v1`, `campaign.overdue.v1`.
