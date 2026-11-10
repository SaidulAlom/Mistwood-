'use client';

/* ============================================================
   ContactForm — the "say hello" panel inside the Contact section.
   Sits under the map and info cards: copy on the left, a glass
   form (name / email / phone / topic / message) on the right,
   with inline validation and the same tick-and-confetti success
   language as the reservation form.

   Delivery: set NEXT_PUBLIC_CONTACT_ENDPOINT (Formspree, a route
   handler, your CRM…) and the payload is POSTed as JSON. With no
   endpoint configured the form validates and confirms locally —
   handy for demos, no fake network call either way.
   ============================================================ */

import { useRef, useState } from 'react';
import { burst } from '@/lib/confetti';
import { SITE_NAME, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_CONTACT } from '@/lib/site';

const EMPTY = { name: '', email: '', phone: '', topic: '', message: '', company: '' };
const TOPICS = [
  'General question',
  'Big group booking',
  'Catering & events',
  'Feedback',
  'Something else',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const formRef = useRef(null);

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((errs) => errs.filter((f) => f !== field));
  };

  const validate = () => {
    const invalid = [];
    if (!values.name.trim()) invalid.push('name');
    if (!EMAIL_RE.test(values.email.trim())) invalid.push('email');
    if (!values.message.trim()) invalid.push('message');
    return invalid;
  };

  const submit = async (e) => {
    e.preventDefault();

    /* honeypot: real people never fill this in */
    if (values.company) {
      setStatus('sent');
      return;
    }

    const invalid = validate();
    if (invalid.length) {
      setErrors(invalid);
      formRef.current?.querySelector(`[name="${invalid[0]}"]`)?.focus();
      return;
    }

    setErrors([]);
    setStatus('sending');

    const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            topic: values.topic || TOPICS[0],
            message: values.message.trim(),
            source: 'mistwood-website',
          }),
        });
        if (!res.ok) throw new Error('Request failed');
      }

      setStatus('sent');
      const rect = formRef.current?.getBoundingClientRect();
      if (rect) burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    } catch (err) {
      setStatus('error');
    }
  };

  const fieldClass = (field) => 'field' + (errors.includes(field) ? ' field-error' : '');
  const sent = status === 'sent';

  return (
    <div className="contact-panel glass" id="contact">
      <div className="contact-copy">
        <p className="kicker kicker-light" data-reveal="up">
          Say hello
        </p>
        <h3 className="contact-title" data-reveal="up">
          SEND US A <em>NOTE</em>
        </h3>
        <p className="contact-note" data-reveal="up">
          Planning a birthday for twenty, asking about a dish, or just want to tell us the thukpa
          was good? Write to us — a real person reads every message.
        </p>

        <ul className="contact-list" data-reveal="up">
          <li>
            <i>✓</i> Replies within a few hours, every day
          </li>
          <li>
            <i>✓</i> Big groups, catering and celebrations welcome
          </li>
          <li>
            <i>✓</i> No spam, no newsletters — just an answer
          </li>
        </ul>

        <div className="contact-quick" data-reveal="up">
          <a
            className="btn btn-wa magnetic"
            href={WHATSAPP_CONTACT}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="eat"
          >
            <span>WhatsApp us</span>
          </a>
          <a className="btn btn-call magnetic" href={`tel:${PHONE_TEL}`} data-cursor="eat">
            <span>
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                aria-hidden="true"
                style={{ marginRight: '8px', verticalAlign: '-2px' }}
              >
                <path
                  d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 5.7 2 2 0 016.5 3.5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              {PHONE_DISPLAY}
            </span>
          </a>
        </div>
      </div>

      <form
        className={'contact-form' + (sent ? ' is-success' : '')}
        ref={formRef}
        onSubmit={submit}
        noValidate
        data-reveal="up"
        aria-label={`Contact ${SITE_NAME}`}
      >
        <label className={fieldClass('name')}>
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={update('name')}
            placeholder="Your name"
            autoComplete="name"
            required
            aria-invalid={errors.includes('name')}
          />
        </label>

        <label className={fieldClass('email')}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={update('email')}
            placeholder="you@example.com"
            autoComplete="email"
            required
            aria-invalid={errors.includes('email')}
          />
        </label>

        <label className="field">
          <span>
            Phone <i>(optional)</i>
          </span>
          <input
            type="tel"
            name="phone"
            value={values.phone}
            onChange={update('phone')}
            placeholder="+91 98765 43210"
            autoComplete="tel"
          />
        </label>

        <label className="field">
          <span>
            Topic <i>(optional)</i>
          </span>
          <select name="topic" value={values.topic} onChange={update('topic')}>
            <option value="">Pick one</option>
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>

        <label className={fieldClass('message') + ' field-wide'}>
          <span>Message</span>
          <textarea
            name="message"
            rows={5}
            value={values.message}
            onChange={update('message')}
            placeholder="Tell us what you need — date, number of people, anything helpful."
            required
            aria-invalid={errors.includes('message')}
          />
        </label>

        {/* spam honeypot — hidden from people, tempting to bots */}
        <input
          className="hp"
          type="text"
          name="company"
          value={values.company}
          onChange={update('company')}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="contact-submit field-wide">
          <button
            type="submit"
            className="btn btn-primary magnetic"
            data-cursor="eat"
            disabled={status === 'sending'}
          >
            <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
          </button>
          <p className="contact-fineprint">
            {status === 'error'
              ? `That didn’t go through — please call ${PHONE_DISPLAY} or try again.`
              : 'Goes straight to the restaurant inbox.'}
          </p>
        </div>

        <div className={'contact-success' + (sent ? ' show' : '')} role="status" aria-live="polite">
          <svg className="check" viewBox="0 0 80 80" aria-hidden="true">
            <circle
              className="check-circle"
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#F28C28"
              strokeWidth="3"
              strokeDasharray="214"
              strokeDashoffset="214"
            />
            <path
              className="check-tick"
              d="M25 42l11 11 19-22"
              fill="none"
              stroke="#F28C28"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50"
              strokeDashoffset="50"
            />
          </svg>
          <h4>
            Thanks, <span>{values.name.split(' ')[0] || 'friend'}</span>!
          </h4>
          <p>
            Your message is with us. We usually reply within a few hours — if it&apos;s urgent,
            call <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>.
          </p>
        </div>
      </form>
    </div>
  );
}
