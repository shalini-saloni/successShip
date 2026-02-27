export const SCENARIOS = [
  {
    id: 'invoice',
    title: 'Invoice Processing',
    subtitle: 'Supplier XYZ · ₹2,50,000',
    entity: 'Supplier XYZ',
    query:
      'Process invoice from Supplier XYZ for ₹2,50,000. Should this be fast-tracked for payment or held for quality inspection?',
    relevantIds: ['m001', 'm002', 'm003', 'm004', 'm005'],
    color: '#D97706',
    light: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    id: 'support',
    title: 'Support Ticket Escalation',
    subtitle: 'TechCorp Inc. · Integration Issue',
    entity: 'TechCorp Inc.',
    query:
      'TechCorp Inc. submitted a support ticket about critical integration failures. Should this be escalated? Who should be involved and how?',
    relevantIds: ['m006', 'm007', 'm008', 'm009'],
    color: '#6366F1',
    light: '#EEF2FF',
    border: '#C7D2FE',
  },
]
