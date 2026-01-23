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
    You are an expert email summarizer. Your task is to analyze the email content and return a detailed, lengthy summary in professional Markdown format.
    
    The summary should include:
    1. **Context/Overview**: A clear explanation of what the email is about and the background.
    2. **Key Points**: A detailed breakdown of the main information shared.
    3. **Action Items/Next Steps**: Clear, bulleted list of what needs to be done next or what the outcome should be.

    Use Markdown features like bold text, bullet points, and headers to make it visually structured and easy to read.
    
    Now summarize this email:
    Body: ${body}
    `;
}
