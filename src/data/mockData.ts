import type { LucideIcon } from 'lucide-react'
import { Code2, Database, Palette, ShieldCheck, Smartphone, BriefcaseBusiness } from 'lucide-react'

export type Job = {
  id: number
  company: string
  title: string
  area: string
  location: string
  modality: 'Híbrido' | 'Remoto' | 'Presencial'
  type: string
  stipend: string
  deadline: string
  publishedAt: string
  logo: string
  logoClass: string
  tags: string[]
  description: string
  fit: number
  icon: LucideIcon
}

export const jobs: Job[] = [
  {
    id: 1, company: 'NuvemLab', title: 'Estágio em Desenvolvimento Front-end', area: 'Tecnologia', location: 'Fortaleza, CE', modality: 'Híbrido', type: 'Estágio', stipend: 'R$ 1.400 + benefícios', deadline: 'Inscrições até 12 nov', publishedAt: '2026-10-29', logo: 'N', logoClass: 'logo-lime', tags: ['React', 'TypeScript', 'CSS'], description: 'Apoie o time de produto na construção de interfaces acessíveis e responsivas. Você vai aprender junto a desenvolvedores experientes, participar de code reviews e transformar ideias em experiências digitais.', fit: 86, icon: Code2,
  },
  {
    id: 2, company: 'DataCeará', title: 'Estágio em Engenharia de Dados', area: 'Dados', location: 'Fortaleza, CE', modality: 'Híbrido', type: 'Estágio', stipend: 'R$ 1.250 + auxílio-transporte', deadline: 'Inscrições até 16 nov', publishedAt: '2026-10-28', logo: 'D', logoClass: 'logo-blue', tags: ['SQL', 'Python', 'Dados'], description: 'Trabalhe com organização e qualidade de dados, consultas SQL e automações simples. A vaga inclui acompanhamento técnico e participação em projetos reais do time de dados.', fit: 74, icon: Database,
  },
  {
    id: 3, company: 'Maré Studio', title: 'Estágio em UI/UX Design', area: 'Design', location: 'Fortaleza, CE', modality: 'Remoto', type: 'Estágio', stipend: 'R$ 1.100', deadline: 'Inscrições até 20 nov', publishedAt: '2026-10-27', logo: 'M', logoClass: 'logo-pink', tags: ['Figma', 'Pesquisa', 'Design system'], description: 'Contribua com pesquisa de usuários, protótipos e melhorias de usabilidade em produtos digitais. Portfólio acadêmico ou pessoal será bem-vindo.', fit: 69, icon: Palette,
  },
  {
    id: 4, company: 'SeguraTech', title: 'Estágio em Segurança da Informação', area: 'Segurança', location: 'Fortaleza, CE', modality: 'Presencial', type: 'Estágio', stipend: 'R$ 1.500 + benefícios', deadline: 'Inscrições até 22 nov', publishedAt: '2026-10-25', logo: 'S', logoClass: 'logo-violet', tags: ['Redes', 'Linux', 'Segurança'], description: 'Apoie atividades de inventário, documentação e acompanhamento de boas práticas de segurança em um ambiente colaborativo e orientado a aprendizado.', fit: 61, icon: ShieldCheck,
  },
  {
    id: 5, company: 'Orbit Mobile', title: 'Estágio em Desenvolvimento de Software', area: 'Tecnologia', location: 'Caucaia, CE', modality: 'Híbrido', type: 'Estágio', stipend: 'R$ 1.300', deadline: 'Inscrições até 25 nov', publishedAt: '2026-10-23', logo: 'O', logoClass: 'logo-orange', tags: ['JavaScript', 'APIs', 'Git'], description: 'Participe da implementação de funcionalidades, integração de APIs e melhoria contínua de aplicações. A empresa oferece mentoria semanal e trilha de aprendizagem.', fit: 78, icon: Smartphone,
  },
  {
    id: 6, company: 'Impacto Social', title: 'Estágio em Projetos e Inovação', area: 'Projetos', location: 'Fortaleza, CE', modality: 'Presencial', type: 'Estágio', stipend: 'Bolsa a combinar', deadline: 'Inscrições até 28 nov', publishedAt: '2026-10-20', logo: 'I', logoClass: 'logo-teal', tags: ['Inovação', 'Pesquisa', 'Comunicação'], description: 'Ajude a mapear desafios, organizar experimentos e documentar iniciativas de impacto social. Ideal para quem gosta de trabalho em equipe e resolução de problemas.', fit: 57, icon: BriefcaseBusiness,
  },
]

export type Application = {
  id: number
  jobId: number
  title: string
  company: string
  date: string
  status: 'Em análise' | 'Em seleção' | 'Entrevista agendada' | 'Enviada' | 'Vaga cancelada'
  statusTone: 'blue' | 'purple' | 'green' | 'gray' | 'amber'
  nextStep: string
}

export const initialApplications: Application[] = [
  { id: 101, jobId: 2, title: 'Estágio em Engenharia de Dados', company: 'DataCeará', date: '22 out 2026', status: 'Em seleção', statusTone: 'purple', nextStep: 'Acompanhe as próximas etapas divulgadas pela empresa.' },
  { id: 102, jobId: 5, title: 'Estágio em Desenvolvimento de Software', company: 'Orbit Mobile', date: '19 out 2026', status: 'Entrevista agendada', statusTone: 'green', nextStep: 'Confira as informações da convocação na timeline.' },
  { id: 103, jobId: 3, title: 'Estágio em UI/UX Design', company: 'Maré Studio', date: '15 out 2026', status: 'Em análise', statusTone: 'blue', nextStep: 'A empresa ainda está analisando as candidaturas.' },
]
