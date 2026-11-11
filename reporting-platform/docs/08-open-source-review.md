# 08. Что использовать готовым (состояние на 11.11.2026)

| Инструмент | Назначение | Решение |
| --- | --- | --- |
| Cordis (`cordis`, MIT, версия 4 RC) | композиция plugin/services/lifecycle | **экспериментальное архитектурное ядро**; зафиксировать пакет и версию после теста |
| DSH / DeepSeek Harness | пример «everything is a plugin», profiles и bundles | **изучать, не встраивать** — агентный runtime не нужен |
| JSON Forms (MIT) | React-рендеринг JSON Schema форм | **рекомендовать** для MVP |
| SurveyJS Creator | визуальный редактор | изучить коммерческое лицензирование до выбора |
| Flowable OSS (Apache-2.0) | BPMN/DMN/workflows | опционально, если маршруты сложнее простого state machine; отдельный Java сервис |
| pg-boss (MIT) | задачи по расписанию/повторы | **рекомендовать** для MVP, idempotency обязательна |
| ExcelJS / шаблонизатор DOCX | офисные документы | отдельно проверить совместимость и лицензию выбранных пакетов |
| Camunda 8 | Enterprise BPMN | не выбирать без подтверждения необходимости и лицензирования |

## Почему не Flowable сразу
Для начального процесса `draft -> submitted -> returned/approved` достаточно явного состояния, проверяемых переходов и истории. Если появятся ветвления, параллельные согласования, множественные таймеры и BPMN-дизайнер для методологов — сделать отдельный spike Flowable. Не превращать каждую форму в workflow-движок.

## Риски Cordis
- API 4.x активно развивается и может ломать совместимость; использовать **одну** реализацию Cordis во всём монорепозитории.
- Не путать `cordis` из независимого репозитория и `@deepseek-ai/cordis`, поставляемый с DSH: совместимость интерфейсов не следует предполагать автоматически.
- Динамическая перезагрузка удобна для адаптеров, но **не** заменяет строгие транзакционные границы бизнес-операций.
- Решение об окончательном использовании Cordis принять после теста в `docs/adr/0001-cordis.md`.

## Проверенные публичные источники
- DSH architecture: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- Cordis npm: https://www.npmjs.com/package/cordis
- `@deepseek-ai/cordis`: https://www.npmjs.com/package/@deepseek-ai/cordis
- JSON Forms: https://github.com/eclipsesource/jsonforms
- pg-boss: https://pgboss.io/introduction
- Flowable: https://github.com/flowable/flowable-engine

Перед включением в государственную инфраструктуру отдельно проверить актуальные версии, реестр уязвимостей, лицензии и зеркалирование пакетов в закрытый контур.
