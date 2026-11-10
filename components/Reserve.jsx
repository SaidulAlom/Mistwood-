'use client';

/* ============================================================
   Reservation — frosted-glass form with inline validation and
   an animated success state (SVG tick draws + confetti).

   Delivery: with NEXT_PUBLIC_CONTACT_ENDPOINT set, the booking is
   POSTed as JSON (type: 'reservation') to the same endpoint the
   contact form uses. Without it the form confirms locally.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { burst } from '@/lib/confetti';
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_RESERVE } from '@/lib/site';

const EMPTY = { name: '', phone: '', date: '', time: '', guests: '', notes: '' };
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
const REQUIRED = ['name', 'phone', 'date', 'time', 'guests'];

export default function Reserve() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const [sent, setSent] = useState(false);
  const [minDate, setMinDate] = useState('');
  const formRef = useRef(null);

  /* today's date as the earliest bookable day — client-side only,
     so the server and client markup match on first paint */
  useEffect(() => {
    setMinDate(new Date().toISOString().split('T')[0]);
  }, []);

  const update = (field) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((errs) => errs.filter((f) => f !== field));
  };

  const submit = async (e) => {
    e.preventDefault();

    const missing = REQUIRED.filter((field) => !values[field].trim());
    if (missing.length) {
      setErrors(missing);
      formRef.current?.querySelector(`[name="${missing[0]}"]`)?.focus();
      return;
    }

    setErrors([]);

    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            type: 'reservation',
            name: values.name.trim(),
            phone: values.phone.trim(),
            date: values.date,
            time: values.time,
            guests: values.guests,
            notes: values.notes.trim(),
            source: 'mistwood-website',
          }),
        });
        if (!res.ok) throw new Error('Request failed');
      } catch (err) {
        /* don't lose the guest — fall back to the phone number */
        setErrors(['submit']);
        setSent(false);
        return;
      }
    }

    setSent(true);

    const rect = formRef.current?.getBoundingClientRect();
    if (rect) burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 90);
  };

  const fieldClass = (field) => 'field' + (errors.includes(field) ? ' field-error' : '');

  return (
    <section className="reserve" id="reserve">
      <div className="reserve-glass glass">
        <div className="reserve-left">
          <p className="kicker kicker-light" data-reveal="up">
            Reservations
          </p>
          <h2 className="reserve-title" data-reveal="up">
            SAVE YOUR <em>SEAT</em>
          </h2>
          <p className="reserve-note" data-reveal="up">
            Walk-ins are always welcome, but weekends get busy. Drop your details and we&apos;ll
            hold a table for you.
          </p>
          <ul className="reserve-list" data-reveal="up">
            <li>
              <i>✓</i> We call within the hour to confirm
            </li>
            <li>
              <i>✓</i> No deposit — no stress
            </li>
            <li>
              <i>✓</i> Big groups and kids welcome
            </li>
          </ul>
          <div className="reserve-actions" data-reveal="up">
            <a
              className="btn btn-wa magnetic"
              href={WHATSAPP_RESERVE}
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
          className={'reserve-form' + (sent ? ' is-success' : '')}
          id="reserveForm"
          ref={formRef}
          onSubmit={submit}
          noValidate
          data-reveal="up"
        >
          <label className={fieldClass('name')}>
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={update('name')}
              required
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={errors.includes('name')}
            />
          </label>

          <label className={fieldClass('phone')}>
            <span>Phone</span>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={update('phone')}
              required
              placeholder="+91 98765 43210"
              autoComplete="tel"
              aria-invalid={errors.includes('phone')}
            />
          </label>

          <label className={fieldClass('date')}>
            <span>Date</span>
            <input
              type="date"
              name="date"
              value={values.date}
              onChange={update('date')}
              min={minDate}
              required
              aria-invalid={errors.includes('date')}
            />
          </label>

          <label className={fieldClass('time')}>
            <span>Time</span>
            <select
              name="time"
              value={values.time}
              onChange={update('time')}
              required
              aria-invalid={errors.includes('time')}
            >
              <option value="">Pick a slot</option>
              <option>11:30 AM</option>
              <option>12:30 PM</option>
              <option>1:30 PM</option>
              <option>6:30 PM</option>
              <option>7:30 PM</option>
              <option>8:30 PM</option>
            </select>
          </label>

          <label className={fieldClass('guests')}>
            <span>Guests</span>
            <select
              name="guests"
              value={values.guests}
              onChange={update('guests')}
              required
              aria-invalid={errors.includes('guests')}
            >
              <option value="">How many</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9+ (call us)</option>
            </select>
          </label>

          <label className="field field-wide">
            <span>
              Notes <i>(optional)</i>
            </span>
            <input
              type="text"
              name="notes"
              value={values.notes}
              onChange={update('notes')}
              placeholder="Birthday? Window table? Allergies?"
            />
          </label>

          <button type="submit" className="btn btn-primary btn-block magnetic" data-cursor="eat">
            <span>Confirm</span>
          </button>

          {errors.includes('submit') && (
            <p className="form-error field-wide" role="alert">
              That didn&apos;t go through — please call{' '}
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a> and we&apos;ll sort it out.
            </p>
          )}

          {/* success state (revealed by .is-success) */}
          <div className={'reserve-success' + (sent ? ' show' : '')} aria-hidden={!sent} role="status">
            <svg className="check" viewBox="0 0 80 80">
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
            <h3>
              Thank you, <span className="rs-name">{values.name || 'friend'}</span>!
            </h3>
            <p>
              Your table request is in. We&apos;ll call to confirm shortly — in the meantime, the
              momos are steaming.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
