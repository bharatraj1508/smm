export function generateCategoryPrompt(subject, from, preview) {
  return `
    You are an expert email classifier. Your task is to analyze the email content and return which type of email it is with the reason you chose for this classification
    
    1. "newsletter" – regular updates, blog digests, community announcements.
    2. "job_alert" – job postings or hiring notifications.
    3. "personal" – one-to-one or conversational emails from individuals.
    4. "transactional" – receipts, confirmations, shipping updates, OTPs, invoices.
    5. "promotional" – sales, discounts, offers, marketing campaigns, product promotions.
  
    Now classify this email:
    
    Subject: ${subject}
    From: ${from}
    Preview: ${preview}
    `;
}

export function generateSummaryPrompt(body) {
  return `
    You are an expert email summarizer. Your task is to provide a highly concise, "at-a-glance" summary of the email in professional Markdown format.
    
    The summary MUST be brief and to the point. Follow this structure:
    1. **The Gist**: A single, impactful sentence explaining what this email is about.
    2. **Key Points**: 3-5 bullet points of the most essential information.
    3. **Next Steps**: Short, actionable list of what needs to be done.

    Use Markdown (bolding, bullets) for quick scanning. Avoid unnecessary context or lengthy explanations.
    
    Now summarize this email:
    Body: ${body}
    `;
}
