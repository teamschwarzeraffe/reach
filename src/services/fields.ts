export let getFieldDefinitions = (tableConfig, record?) => {
  let definitionObject = tableConfig.definition;

  // Convert the nested objects to an array
  let definitionArray = Object.values(definitionObject);

  let fields = Object.entries(tableConfig.fields ?? []);

  let formFields = definitionArray.map((field: { config: { name: string } }) => {
    let key = field.config.name;
    let fieldOverride = tableConfig.fields ? tableConfig.fields[key] : null;
    let fieldType = fieldOverride ? fieldOverride.type : "textField";

    if (record && record[key]) {
      return { key, type: fieldType, value: record[key] };
    } else {
      return { key, type: fieldType };
    }
  });

  tableConfig.formFields = formFields;
  // console.log("formFields", formFields);
  return tableConfig;
};
