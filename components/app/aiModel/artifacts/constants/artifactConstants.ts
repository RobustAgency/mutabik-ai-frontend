// Updated artifact type options matching backend enum
export const artifactTypeOptions = [
    { value: "model_weights", label: "Model Weights / Binary" },
    { value: "serialized_model", label: "Serialized Model (.pkl, .joblib)" },
    { value: "onnx_model", label: "ONNX / Portable Model" },
    { value: "training_script", label: "Training Script" },
    { value: "inference_script", label: "Inference Script" },
    { value: "config_file", label: "Config File (YAML/JSON)" },
    { value: "pipeline_definition", label: "Pipeline Definition (Airflow/Kubeflow)" },
    { value: "container_image", label: "Container Image Reference" },
    { value: "notebook", label: "Notebook (.ipynb)" },
    { value: "evaluation_report", label: "Evaluation Report" },
    { value: "explainability_report", label: "Explainability Report" },
    { value: "documentation", label: "Documentation" },
    { value: "model_card", label: "Model Card" },
    { value: "data_schema", label: "Data Schema" },
    { value: "other", label: "Other" },
];

export const environmentOptions = [
    { value: "development", label: "Development" },
    { value: "testing", label: "Testing" },
    { value: "staging", label: "Staging" },
    { value: "production", label: "Production" },
    { value: "shared", label: "Shared" },
    { value: "archive", label: "Archive" },
];

export const fileFormatOptions = [
    { value: "binary", label: "Binary" },
    { value: "onnx", label: "ONNX" },
    { value: "pickle_joblib", label: "Pickle / Joblib" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "csv", label: "CSV" },
    { value: "parquet", label: "Parquet" },
    { value: "notebook", label: "Notebook" },
    { value: "pdf", label: "PDF" },
    { value: "markdown_txt", label: "Markdown / TXT" },
    { value: "docker_oci_image", label: "Docker / OCI Image" },
    { value: "other", label: "Other" },
];

export const checksumAlgorithmOptions = [
    { value: "sha256", label: "SHA-256" },
    { value: "sha1", label: "SHA-1" },
    { value: "md5", label: "MD5 (Legacy)" },
    { value: "none", label: "None / Not Applicable" },
];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

