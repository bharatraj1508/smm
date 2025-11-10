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
