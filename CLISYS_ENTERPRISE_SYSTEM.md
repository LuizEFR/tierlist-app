# CLISYS: Sistema de Gestão Clínica Inteligente (Enterprise Edition)

Este documento define a especificação completa, arquitetura conceitual e roadmap estratégico do **CLISYS**, uma plataforma de gestão clínica de nível enterprise, projetada sob a filosofia **AI-First** e o princípio de **Zero Papel**.

---

## 1. Visão Geral do Sistema

### Objetivo da Plataforma
O CLISYS visa transformar a gestão de clínicas ambulatoriais e consultórios através de uma plataforma 100% digital que integra fluxos operacionais, clínicos e financeiros com inteligência artificial generativa e preditiva.

### Proposta de Valor
*   **Para Médicos:** Redução da carga administrativa através de transcrição e resumos automáticos, apoio à decisão clínica e prontuário estruturado.
*   **Para Gestores:** Visibilidade total da operação, controle financeiro rigoroso (TISS/TUSS), redução de *no-show* e dashboards preditivos.
*   **Para Pacientes:** Jornada fluida, desde o agendamento online até o acesso fácil a exames e prescrições via portal dedicado.

### Diferenciais Estratégicos
*   **AI-First Native:** A inteligência artificial não é um "add-on", mas parte integrante do fluxo (Triagem AI, Copilot em tempo real, Auditoria de qualidade).
*   **Zero Papel (Compliance Total):** Fluxos internos 100% digitais com assinatura ICP-Brasil, garantindo segurança jurídica e eficiência.
*   **Arquitetura Multi-tenant:** Suporte a redes de clínicas com isolamento de dados (RLS) e padronização de protocolos.

---

## 2. Módulos do Sistema (Macroestrutura)

### 2.1. Cadastro e Gestão de Pacientes (Core)
*   **Objetivo:** Centralizar todas as informações demográficas, clínicas e administrativas do paciente.
*   **Funcionalidades:** CRM de saúde, histórico unificado, gestão de anexos (exames), marcação de pacientes VIP/crônicos.
*   **Perfis:** Recepcionista, Médico, Enfermeiro.

### 2.2. Agenda e Atendimento Inteligente
*   **Objetivo:** Orquestrar o fluxo de pacientes na clínica.
*   **Funcionalidades:** Múltiplas agendas (médico/sala/equipamento), controle de encaixes, lista de espera inteligente, confirmação via WhatsApp.
*   **Inovação AI:** Predição de *no-show* baseada em histórico e fatores externos.

### 2.3. Prontuário Eletrônico (EHR/PEP) - Enterprise Level
*   **Objetivo:** Registro clínico estruturado e seguro.
*   **Funcionalidades:** Timeline do paciente, evolução clínica, anamnese configurável, integração com CID-10 e TUSS.
*   **Inovação AI:** Transcrição em tempo real (Deepgram), resumos automáticos (SOAP) e Copilot de apoio ao diagnóstico.

### 2.4. Prescrição e Evolução Clínica
*   **Objetivo:** Emissão de documentos clínicos válidos.
*   **Funcionalidades:** Receituário digital, atestados, pedidos de exame, integração com base de medicamentos (Memed/Nexodata).
*   **Inovação AI:** Sugestão de prescrição baseada na transcrição da consulta e alertas de interação medicamentosa.

### 2.5. Faturamento, Financeiro e TISS
*   **Objetivo:** Gestão do ciclo de receita.
*   **Funcionalidades:** Emissão de guias TISS (SPSADT, Consulta), geração de lotes XML, gestão de glosas, fluxo de caixa, DRE e repasse médico automático.
*   **Compliance:** Aderência total às normas da ANS.

### 2.6. Telemedicina Integrada
*   **Objetivo:** Atendimento remoto com validade legal.
*   **Funcionalidades:** Sala de vídeo nativa, chat, compartilhamento de tela, gravação da consulta integrada ao prontuário.

### 2.7. Gestão de Estoque e Farmácia
*   **Objetivo:** Controle de insumos e medicamentos.
*   **Funcionalidades:** Gestão de lotes/validade, alertas de reposição, baixa automática por procedimento.

### 2.8. Relatórios e Analytics (BI)
*   **Objetivo:** Suporte à decisão baseada em dados.
*   **Funcionalidades:** Dashboards de ocupação, faturamento por convênio, produtividade médica e análise de conversão.

---

## 3. Perfis de Usuário (RBAC Completo)

| Perfil | Permissões Principais | Restrições | Jornada no Sistema |
| :--- | :--- | :--- | :--- |
| **Médico** | Prontuário, Prescrição, Telemedicina, Ver Agenda. | Não acessa dados financeiros da clínica. | Visualiza agenda -> Inicia consulta -> Usa AI Copilot -> Prescreve -> Finaliza. |
| **Enfermeiro** | Triagem, Sinais Vitais, Evolução, Estoque. | Não altera prescrição médica. | Recebe paciente -> Realiza triagem -> Registra no sistema -> Encaminha ao médico. |
| **Recepcionista** | Agendamento, Check-in, Cadastro, Faturamento Básico. | Não acessa conteúdo clínico (prontuário). | Cadastro -> Agendamento -> Check-in -> Recebimento -> Faturamento. |
| **Financeiro** | Faturamento TISS, Repasse, Fluxo de Caixa, Contas a Pagar/Receber. | Não acessa dados clínicos sensíveis. | Gera lotes TISS -> Concilia pagamentos -> Processa repasses. |
| **Administrador** | Gestão de Usuários, Configurações Globais, Logs, BI. | Nenhuma (Super User). | Configura clínica -> Monitora performance -> Auditoria. |
| **Paciente** | Agendamento Online, Ver Resultados, Telemedicina. | Acesso restrito apenas aos próprios dados. | Agenda -> Faz check-in -> Atendimento -> Acessa prescrição/exames. |

---

## 4. Fluxos Operacionais (End-to-End)

### 4.1. Jornada do Paciente (Digital-First)
1.  **Agendamento:** Paciente agenda via Portal ou WhatsApp (Bot).
2.  **Pré-consulta AI:** Paciente responde triagem automatizada via Chatbot (coleta de queixa principal e sintomas).
3.  **Check-in:** Ao chegar (ou via App), o paciente confirma presença; sistema notifica o médico.
4.  **Atendimento:** Médico utiliza o Prontuário com suporte de Transcrição AI e Copilot.
5.  **Desfecho:** Prescrição digital enviada por SMS/WhatsApp; guia de retorno agendada automaticamente.
6.  **Faturamento:** Sistema gera automaticamente a guia TISS ou fatura particular.

### 4.2. Fluxo de Faturamento e Glosas
1.  **Execução:** Procedimento é marcado como realizado no prontuário.
2.  **Validação:** Motor de regras verifica elegibilidade e preenchimento obrigatório TISS.
3.  **Lote:** Financeiro agrupa guias em lotes XML e envia ao convênio.
4.  **Conciliação:** Importação do arquivo de retorno; sistema identifica glosas automaticamente para recurso.

---

## 5. Regras de Negócio Críticas

*   **RN01 - Assinatura Digital:** Todo documento clínico (receita, atestado, evolução) deve ser assinado digitalmente (ICP-Brasil) para ter validade.
*   **RN02 - Imutabilidade do Prontuário:** Após finalizada a consulta, o registro torna-se imutável; correções devem ser feitas via "Adendo" com log de auditoria.
*   **RN03 - Elegibilidade de Convênio:** O sistema deve validar o token/carteirinha do convênio no ato do check-in para evitar glosas por elegibilidade.
*   **RN04 - Controle de Estoque:** Procedimentos que utilizam insumos (ex: aplicação de medicação) devem abater automaticamente o estoque.

---

## 6. Inteligência e Automação (AI-First)

| Funcionalidade AI | Descrição Técnica | Impacto |
| :--- | :--- | :--- |
| **AI Triage** | Chatbot Claude que qualifica a queixa antes da consulta. | Reduz tempo de anamnese em 25%. |
| **Copilot Real-time** | Análise de áudio (Deepgram) + Sugestões (Claude) em tempo real. | Apoio à decisão e redução de erros médicos. |
| **Auto-SOAP** | Geração automática do resumo da consulta em formato estruturado. | Economiza ~5 min por atendimento. |
| **Predição de No-show** | Modelo de ML que alerta alta probabilidade de falta. | Permite ação proativa da recepção para remanejamento. |
| **Auditoria AI** | Varredura de prontuários em busca de inconsistências ou falta de CID. | Garante compliance e qualidade clínica. |

---

## 7. Compliance e Legislação (Brasil)

*   **LGPD (Lei 13.709/2018):** Criptografia de dados sensíveis, gestão de consentimento e logs de acesso granular.
*   **CFM (Conselhos de Medicina):** Aderência às resoluções de prontuário eletrônico e telemedicina (Res. 2.314/2022).
*   **TISS / ANS:** Padrão de troca de informações de saúde suplementar obrigatório para faturamento de convênios.
*   **Segurança:** Trilha de auditoria completa (Quem, Quando, Onde, O Quê).

---

## 8. Roadmap Evolutivo

### Fase 1: Fundação & Digitalização (Meses 1-2)
*   Implementação do Prontuário Estruturado (PEP).
*   Gestão de Agenda e Check-in Digital.
*   Módulo Financeiro Básico (Fluxo de Caixa).
*   Notificações WhatsApp/SMS.

### Fase 2: Eficiência & AI Assistive (Meses 3-4)
*   Integração de Transcrição AI e Resumos Automáticos.
*   Triagem Pré-consulta via Chatbot.
*   Módulo de Convênios (TISS/TUSS) e Faturamento.
*   Telemedicina Integrada.

### Fase 3: Enterprise & Inteligência Avançada (Meses 5-6)
*   Copilot Clínico em tempo real.
*   Portal do Paciente Completo (Resultados e Pagamentos).
*   Analytics Preditivo e Dashboards de BI.
*   Gestão de Estoque e Farmácia com Automação.
*   Auditoria de Qualidade AI.

---

**Status do Documento:** Definitivo / Enterprise Ready
**Versão:** 1.0
**Autor:** Manus AI (Evolução do CLISYS)
