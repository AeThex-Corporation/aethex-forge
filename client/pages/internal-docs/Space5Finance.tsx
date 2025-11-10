import InternalDocsLayout from "./InternalDocsLayout";

export default function Space5Finance() {
  return (
    <InternalDocsLayout
      title="Finance & Payments Operations"
      description="SOP-301 & SOP-302"
    >
      <div className="space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-300 leading-relaxed">
            This guide covers how we handle contractor payments, invoicing, and
            expense reimbursement. It ensures everyone gets paid on time and
            accurately.
          </p>
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Contractor Payments (SOP-301)
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Payment Cycle</h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>
                  <strong>Invoice Due:</strong> Last day of work month
                </li>
                <li>
                  <strong>Payment Date:</strong> 15th of following month
                </li>
                <li>
                  <strong>Payment Method:</strong> ACH transfer (1-2 business
                  days)
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Invoice Requirements
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>✓ Your name & contractor ID</li>
                <li>✓ Hours worked (with breakdown by day)</li>
                <li>✓ Hourly rate agreed in contract</li>
                <li>✓ Total amount due</li>
                <li>✓ Date range of work</li>
                <li>✓ Your banking information for direct deposit</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Where to Submit</h4>
              <p className="text-sm text-slate-300">
                Email invoices to: <strong>invoicing@aethex.tech</strong>
              </p>
              <p className="text-sm text-slate-300 mt-2">
                Include "INVOICE" in subject line for easy tracking.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Late Payments</h4>
              <p className="text-sm text-slate-300">
                If you don't receive payment within 3 business days of the due
                date, contact HR immediately. We prioritize on-time payment.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Expense & Reimbursement (SOP-302)
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Reimbursable Expenses
              </h4>
              <ul className="text-sm text-slate-300 space-y-2 pl-4">
                <li>✓ Work equipment (laptop, monitor, software)</li>
                <li>✓ Conference & training (approved in advance)</li>
                <li>✓ Travel (flights, hotels, meals)</li>
                <li>✓ Client entertainment (pre-approved)</li>
                <li>✓ Office supplies (if remote/freelancer)</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-400 mb-2">
                Not Reimbursable
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>✗ Personal expenses (meals, gas for commute)</li>
                <li>✗ Expenses without receipts</li>
                <li>✗ Alcohol/entertainment not pre-approved</li>
                <li>✗ Expenses outside company policy</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Reimbursement Process
              </h4>
              <ol className="text-sm text-slate-300 space-y-2 pl-4 list-decimal">
                <li>Spend money on company business (or use company card)</li>
                <li>Keep receipt (photo, email, or original)</li>
                <li>Submit expense report monthly</li>
                <li>Manager approves within 5 business days</li>
                <li>Finance processes reimbursement</li>
                <li>You receive check or ACH transfer</li>
              </ol>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Expense Report Requirements
              </h4>
              <ul className="text-sm text-slate-300 space-y-1 pl-4">
                <li>• Date of expense</li>
                <li>• What was purchased</li>
                <li>• Amount (receipt)</li>
                <li>• Business purpose</li>
                <li>• Project/client (if applicable)</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Submit Expenses To
              </h4>
              <p className="text-sm text-slate-300">
                Email: <strong>expenses@aethex.tech</strong>
              </p>
              <p className="text-sm text-slate-300 mt-2">
                Attach receipts as PDF or image files. Subject: "EXPENSE REPORT
                - [Your Name] - [Month]"
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Tax Considerations
          </h3>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-white">Contractors (1099)</h4>
            <p className="text-sm text-slate-300">
              We issue 1099-NEC for contractor income. You're responsible for
              quarterly estimated tax payments and self-employment tax.
            </p>

            <h4 className="font-semibold text-white mt-4">Employees (W-2)</h4>
            <p className="text-sm text-slate-300">
              We handle payroll taxes. You'll receive a W-2 at year-end. Tax
              withholding is based on your W-4 form.
            </p>

            <p className="text-sm text-slate-400 mt-4">
              <strong>Note:</strong> Consult a tax professional about your
              specific situation.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">
            Common Questions
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Q: When do I get paid?
              </h4>
              <p className="text-sm text-slate-300">
                A: Contractors: 15th of following month. Employees: bi-weekly
                per payroll schedule.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Q: Can I use a company card?
              </h4>
              <p className="text-sm text-slate-300">
                A: For most employees, yes. Contact Finance for company card
                setup. No receipt needed for card expenses.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Q: How long for reimbursement?
              </h4>
              <p className="text-sm text-slate-300">
                A: 10-15 business days after approval. ACH takes 1-2 business
                days once processed.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">
                Q: Lost receipt - what do I do?
              </h4>
              <p className="text-sm text-slate-300">
                A: Email Finance with explanation. Under $50, usually approved
                with manager signature. Over $50, you may not be reimbursed.
              </p>
            </div>
          </div>
        </section>

        <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-900/10">
          <p className="text-sm text-slate-300">
            <strong>Finance Contact:</strong> finance@aethex.tech for questions
            about payments, reimbursements, or tax matters.
          </p>
        </div>
      </div>
    </InternalDocsLayout>
  );
}
