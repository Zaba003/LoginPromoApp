# 04. Концептуальная модель данных

## Основные сущности

```
recipient(id, code, name, active)
report_type(id, code, recipient_id?, title)
regulation_version(id, report_type_id, version, effective_from, status, config_hash)
indicator_definition(id, code, title, unit, dimensions, semantics_version)
form_template(id, report_type_id, code)
form_version(id, template_id, version, data_schema, ui_schema, status, checksum)
form_indicator_binding(id, form_version_id, json_pointer, indicator_definition_id)
report_campaign(id, report_type_id, regulation_version_id, form_version_id, period_start, period_end, status, due_at)
assignment(id, campaign_id, unit_id, assignee_id, due_at, status)
submission(id, assignment_id, current_version_id, status)
submission_version(id, submission_id, number, form_version_id, payload_jsonb, submitted_by, submitted_at, checksum)
approval(id, submission_version_id, stage, actor_id, decision, comment, created_at)
indicator_value(id, definition_id, period_start, period_end, unit_id, value, unit, source_version_id, status)
aggregation_rule_version(id, report_type_id, version, rules_jsonb, checksum)
consolidation(id, campaign_id, rule_version_id, source_set_hash, status)
consolidation_input(consolidation_id, submission_version_id)
consolidation_value(id, consolidation_id, indicator_id, value, lineage_jsonb)
document_template_version(id, report_type_id, version, file_id, checksum)
rendered_document(id, consolidation_id, document_template_version_id, file_id, checksum, status)
audit_event(id, occurred_at, actor_id, action, resource_type, resource_id, before_hash, after_hash, metadata)
outbox_event(id, aggregate_id, event_type, schema_version, payload, created_at, published_at)
```

## Неизменяемость и контроль
- `form_version` после публикации **не редактируется** — создаётся следующая версия.
- `submission_version` после отправки **не переписывается**. Замечания и исправления создают новую версию.
- `consolidation` фиксирует точный список входных `submission_version`, версию регламента, формулу и правила округления.
- `audit_event` append-only; отдельные права доступа/резервные копии и политика хранения.
- При смене оргструктуры сохранять принадлежность на дату отчётного периода, а не только текущий org unit.
- Отсутствие данных ≠ ноль; нулевое значение ≠ не применимо; предусмотреть состояния `missing`, `not_applicable`, `provided` и комментарии.
- Изменение семантики показателя создаёт новую версию или новый `indicator_definition`, нельзя молча сравнивать несопоставимые данные.

## Ограничения на вычисления
- Типизированные числа с определённым масштабом/округлением, для финансовых сумм decimal вместо float.
- Автоматический агрегат не должен складывать несопоставимые единицы, периоды или взаимоисключающие подгруппы.
- Все ручные корректировки итоговых значений должны содержать причину, права, автора и отдельную версию свода.

## Индексы для пилота
`assignment(campaign_id,unit_id)`, `assignment(assignee_id,status,due_at)`,
`submission_version(submission_id,number unique)`, `indicator_value(definition_id,period_start,unit_id)`.
Остальные индексы — после анализа запросов и размера данных.
