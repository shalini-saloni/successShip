export const DECISIONS = {
  invoice: {
    verdict: 'HOLD — Quality Inspection Required',
    level: 'warning',
    confidence: 87,
    summary:
      'Multiple signals point to elevated risk with Supplier XYZ. The recent quality incident (134d ago) combined with the approaching seasonal risk window justifies withholding fast-track payment until physical inspection is signed off.',
    reasoning: [
      {
        memoryId: 'm001',
        iconName: 'AlertTriangle',
        color: '#D97706',
        title: 'Recent Quality Incident — weight 0.92',
        body: '30% defect rate 134 days ago caused ₹50,000 direct loss. Within active monitoring window — primary driver of hold decision.',
      },
      {
        memoryId: 'm004',
        iconName: 'Sun',
        color: '#B45309',
        title: 'Seasonal Risk Window Approaching — PROCEDURAL',
        body: 'Feb delivery sits on the cusp of Mar–May degradation period. Evergreen procedural pattern elevates risk regardless of recency.',
      },
      {
        memoryId: 'm003',
        iconName: 'CreditCard',
        color: '#7C3AED',
        title: 'Payment Dispute History — AGING (0.51 eff.)',
        body: 'Non-receipt dispute 251 days ago adds payment risk. Staged release recommended: 50% on sign-off, 50% on confirmed delivery.',
      },
      {
        memoryId: 'm002',
        iconName: 'Truck',
        color: '#9CA3AF',
        title: 'Logistics Memory Aging — low influence',
        body: 'Warehouse road damage from July 2024 has decayed below threshold. Noted for context; not a blocking factor.',
      },
      {
        memoryId: 'm005',
        iconName: 'XCircle',
        color: '#D1D5DB',
        title: 'Early Payment Discount — STALE (362d, excluded)',
        body: 'Exceeds 300-day reliability threshold. Excluded from scoring. Verify with supplier before acting on.',
      },
    ],
    conflict: {
      label: 'Conflicting Signal Detected',
      body: 'No incidents in the past 4 months hints at improvement trajectory. However, the evergreen seasonal pattern overrides this. Resolution: hold with conditional fast-track if inspection passes within 5 business days and defect rate is under 2%.',
    },
    actions: [
      { iconName: 'Package',     text: 'Raise formal quality inspection — attach PO and GRN for cross-verification' },
      { iconName: 'AlertCircle', text: 'Notify procurement of persistent pattern — flag for supplier risk review' },
      { iconName: 'CreditCard',  text: 'Hold full ₹2,50,000 — staged release after inspection sign-off' },
      { iconName: 'FileText',    text: 'Log decision in Supplier XYZ risk profile for future scoring calibration' },
      { iconName: 'Calendar',    text: 'Schedule post-inspection review — fast-track only if defect rate < 2%' },
    ],
  },

  support: {
    verdict: 'CRITICAL ESCALATION — P1 Within 30 Minutes',
    level: 'critical',
    confidence: 95,
    summary:
      'TechCorp is a high-churn-risk account with deep platform dependency, prior frustration on record, and a technically-demanding CTO. All memory vectors converge on critical urgency. A slow or impersonal response risks the ₹50L contract — renewal is 10 months away.',
    reasoning: [
      {
        memoryId: 'm006',
        iconName: 'AlertTriangle',
        color: '#DC2626',
        title: 'Active Churn Signal — competitor mentioned 68d ago',
        body: 'Customer flagged competitors during ₹50L renewal. Any failure now amplifies churn probability significantly. Emotional flag active.',
      },
      {
        memoryId: 'm008',
        iconName: 'TrendingUp',
        color: '#16A34A',
        title: 'API Usage +300% — platform is mission-critical',
        body: 'Rapid dependency growth means this failure directly impacts TechCorp live operations. Urgency multiplier: 1.3×.',
      },
      {
        memoryId: 'm007',
        iconName: 'Heart',
        color: '#E11D48',
        title: 'Emotional Memory — prior frustration on speed (190d)',
        body: 'Customer already criticised 48h resolution time. Same issue type recurring will compound frustration exponentially.',
      },
      {
        memoryId: 'm009',
        iconName: 'Users',
        color: '#6366F1',
        title: 'Stakeholder Pref — CTO requires technical depth',
        body: 'Status emails will not satisfy this stakeholder. CTO expects RCA, system logs, root cause, and realistic ETA.',
      },
    ],
    conflict: {
      label: 'No Conflicting Signals',
      body: 'All four memory vectors converge on the same conclusion. No historical data contradicts immediate escalation. Confidence floor elevated to 95% — execute without deliberation.',
    },
    actions: [
      { iconName: 'Zap',       text: 'Assign P1 immediately — senior engineer must acknowledge within 30 minutes' },
      { iconName: 'PhoneCall', text: 'CSM calls TechCorp contact within 1 hour — do not email first' },
      { iconName: 'FileText',  text: 'Prepare technical RCA for CTO — logs, root cause, fix plan, realistic ETA' },
      { iconName: 'Clock',     text: '2-hour mandatory progress check-in regardless of resolution status' },
      { iconName: 'Shield',    text: 'Brief retention team — prepare competitive counter-narrative if risk escalates' },
      { iconName: 'Star',      text: 'Post-resolution: offer proactive architecture review as goodwill gesture' },
    ],
  },
}
