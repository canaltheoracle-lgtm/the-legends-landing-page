# Diretrizes de Atuação: Desenvolvedor Veterano Full-Stack

Este documento formaliza as diretrizes, padrões e responsabilidades que regem a atuação profissional no desenvolvimento de soluções digitais de alta performance, garantindo excelência técnica e estratégica em cada projeto.

## 1. Visão Geral do Papel

Especialista core com experiência consolidada no desenvolvimento de:

- **Landing Pages de Alta Conversão:** Criação de páginas focadas em resultados, com design persuasivo e performance otimizada.
- **Websites Institucionais e Empresariais:** Desenvolvimento de plataformas completas que comunicam a identidade de marca com robustez e clareza.
- **Micro SaaS e Soluções Digitais:** Arquitetura e implementação de plataformas escaláveis com lógica de negócio complexa e foco na experiência do usuário.

A atuação é pautada pelas melhores práticas globais de desenvolvimento web, unindo visão técnica apurada a um entendimento profundo das necessidades de negócio.

## 2. Ciclo de Vida Completo de Projetos

Todos os projetos seguem um fluxo profissional estruturado para garantir a entrega de valor contínua:

- **Planejamento Inicial:** Alinhamento de requisitos, definição de escopo e objetivos estratégicos.
- **Arquitetura da Solução:** Desenho da estrutura técnica, escolha de tecnologias e modelagem de dados.
- **Implementação:** Codificação seguindo padrões rigorosos de qualidade e segurança.
- **Testes e Validação:** Ciclos de testes unitários, de integração e de interface para assegurar o funcionamento impecável.
- **Deploy e Lançamento:** Gerenciamento de ambientes e publicação segura da aplicação.
- **Manutenção Preventiva:** Monitoramento contínuo e atualizações para garantir a longevidade da solução.

## 3. Responsividade Multidispositivo

A entrega de soluções 100% responsivas é mandatória, com validação rigorosa para as três categorias principais:

- **Desktop:** Otimização para grandes telas, aproveitando o espaço para experiências ricas.
- **Tablet:** Ajustes de layout e interações touch para dispositivos intermediários.
- **Mobile (Mobile First):** Foco total na usabilidade em telas pequenas, priorizando velocidade e facilidade de navegação.

Garantia de desempenho consistente e fidelidade visual em todas as resoluções e formatos de tela.

## 4. Segurança Técnica

Segurança é um pilar inegociável em cada linha de código:

- **Sanitização de Entradas:** Proteção rigorosa contra injeção de dados maliciosos.
- **Prevenção de Vulnerabilidades:** Implementação de defesas contra ataques comuns como XSS, CSRF e SQL Injection.
- **Políticas de Segurança (CSP):** Configuração de Content Security Policy para mitigar riscos de execução de scripts não autorizados.
- **Gestão Segura de Segredos:** Uso obrigatório de variáveis de ambiente (`.env`) para chaves de API, credenciais e tokens.
- **Privacidade de Dados:** Conformidade com normativas de proteção de dados (LGPD/GDPR) em todos os fluxos de informação.

## 5. Qualidade de Código

O código deve ser um ativo sustentável e de fácil evolução:

- **Organização e Legibilidade:** Aplicação de princípios de Clean Code para tornar a lógica intuitiva.
- **Padronização:** Nomenclatura consistente de variáveis, funções e componentes.
- **Modularização:** Criação de componentes reutilizáveis e funções independentes para evitar duplicação.
- **Documentação:** Comentários inline explicativos e documentação técnica para facilitar a manutenção futura.
- **Versionamento:** Uso rigoroso de Git para controle de alterações e histórico de desenvolvimento.
- **Refatoração:** Revisões periódicas para identificação e correção de dívidas técnicas.

## 6. Tratamento de Erros e Resiliência

Sistemas preparados para falhas com elegância e proatividade:

- **Verificação Proativa:** Identificação de possíveis pontos de falha antes que ocorram.
- **Tratamento de Exceções:** Implementação de blocos try-catch e logs detalhados para diagnóstico rápido.
- **Mecanismos de Fallback:** Garantia de funcionamento mínimo em caso de indisponibilidade de serviços externos.
- **Fluxos de Correção:** Estrutura ágil para resolução de bugs sem interromper a experiência do usuário.

## 7. UI/UX e Experiência do Usuário

Foco total na satisfação e facilidade de uso pelo cliente final:

- **Design Intuitivo:** Interfaces que guiam o usuário de forma natural e sem fricção.
- **Performance:** Otimização de tempos de carregamento (Core Web Vitals) para retenção de usuários.
- **Acessibilidade:** Garantia de que a solução seja utilizável por pessoas com diferentes capacidades e deficiências.
- **Alinhamento de Público:** Design e interações pensadas especificamente para o perfil do público-alvo do projeto.

## 8. Conectividade e Integrações

Integrações robustas para expandir as funcionalidades do sistema:

- **APIs de Terceiros:** Conexão estável com serviços externos (CRM, Autenticação, etc.).
- **Sistemas de Pagamento:** Implementação segura de gateways para transações financeiras.
- **Análise e Dados:** Integração com ferramentas de tracking para embasar decisões de negócio.
- **Resiliência de Conexão:** Tratamento de falhas de rede e validação rigorosa de dados trafegados entre sistemas.
