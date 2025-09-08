import { useState } from "react";

interface TermsProps {
  title: string;
  onAccept: () => void;
}

export default function TermsAndConditions({ title, onAccept }: TermsProps) {
  const [checked, setChecked] = useState(false);

  return (
    <section className="min-h-screen bg-stone-950 relative flex items-center justify-center p-6">
      {/* Fondo decorativo con círculos */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05)_0%,_transparent_70%),_radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.05)_0%,_transparent_70%)] z-0" />

      {/* Card blanca centrada */}
      <div className="relative z-10 max-w-3xl w-full bg-gray-100 rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-pink-500 text-center">
          {title}
        </h2>

        {/* Texto scrollable */}
        <div className="overflow-y-auto max-h-[50vh] text-black text-sm space-y-4 mb-6 p-2">
          <p>
            <strong>1. Introduction and Acceptance of Terms:</strong> By using
            this artist platform, you agree to these Terms. If you do not agree,
            do not use the platform. These Terms are a legal agreement between
            you and the Platform.
          </p>
          <p>
            <strong>2. Purpose of the Platform:</strong> The Platform is a
            digital space for artists to promote their work, publish art,
            offer/receive commissions, and connect with a community.
          </p>
          <p>
            <strong>3. Intellectual Property and User Content:</strong> You own
            the art you upload. By posting, you grant the Platform a license to
            display and promote your work on the site. Plagiarism, unauthorized
            copying, and copyright infringement are strictly prohibited..
          </p>
          <p>
            <strong>4. User Conduct:</strong> You agree not to post illegal,
            offensive, or harassing content. Do not use the Platform for
            unauthorized commercial purposes or interfere with its operation.
          </p>
          <p>
            <strong>5. Commissions System:</strong> The Platform facilitates
            commissions, but is not responsible for any agreements, payments, or
            the quality of the work. You are fully responsible for your own
            transactions.
          </p>
          <p>
            <strong>
              6. Sanctions for Non-Compliance Violating these Terms:
            </strong>{" "}
            Especially plagiarism, may result in sanctions including content
            removal, account suspension, or a permanent ban from the Platform.
            The Platform decides on the severity of the sanction.
          </p>
          <p>
            <strong>7. Disclaimer of Liability:</strong> The Platform is
            provided "as is." We are not responsible for the conduct of our
            users or their content. You are solely responsible for your
            interactions with other users.
          </p>
          <p>
            <strong>8. Modifications of the Terms:</strong> These Terms may be
            updated at any time. Your continued use of the Platform after an
            update means you accept the new Terms.
          </p>
          <p>
            <strong>9. Jurisdiction and Applicable Law:</strong> These Terms are
            governed by the laws of [Costa Rica].
          </p>
        </div>

        {/* Checkbox y botón */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            id="accept"
            className="accent-pink-500 w-5 h-5"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <label htmlFor="accept" className="text-gray-700 text-sm">
            I have read and accept all the terms and conditions
          </label>
        </div>

        <button
          type="button"
          disabled={!checked}
          onClick={onAccept}
          className={`w-full py-2 rounded-full font-semibold text-white ${
            checked
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-gray-400 cursor-not-allowed"
          } transition-shadow shadow-md`}
        >
          Accept
        </button>
      </div>
    </section>
  );
}
