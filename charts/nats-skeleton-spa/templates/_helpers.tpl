{{/*
Expand the name of the chart.
*/}}
{{- define "nats-skeleton-spa.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nats-skeleton-spa.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "nats-skeleton-spa.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "nats-skeleton-spa.labels" -}}
helm.sh/chart: {{ include "nats-skeleton-spa.chart" . }}
{{ include "nats-skeleton-spa.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "nats-skeleton-spa.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nats-skeleton-spa.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "nats-skeleton-spa.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "nats-skeleton-spa.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
-------------------------------------------------------------------------------
Additional helper functions
-------------------------------------------------------------------------------
*/}}

{{- define "nats-skeleton-spa.nginxSslPort" -}}
{{- if .Values.config.nginx.ssl -}}
443
{{- else -}}
80
{{- end -}}
{{- end -}}

{{- define "nats-skeleton-spa.nginxHealthzScheme" -}}
{{- if .Values.config.nginx.ssl -}}
HTTPS
{{- else -}}
HTTP
{{- end -}}
{{- end -}}

{{- define "nats-skeleton-spa.nginxSslFlags" -}}
{{- if .Values.config.nginx.ssl -}}
ssl
{{- end -}}
{{- end -}}

{{- define "nats-skeleton-spa.natsWebsocketProtocol" -}}
{{- if .Values.config.nats.ssl -}}
wss
{{- else -}}
ws
{{- end -}}
{{- end -}}

{{- define "nats-skeleton-spa.natsHttpProtocol" -}}
{{- if .Values.config.nats.ssl -}}
https
{{- else -}}
http
{{- end -}}
{{- end -}}