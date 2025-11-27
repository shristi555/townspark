'use client';

import { useState } from 'react';

export default function MyReports() {
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = {
    total: 12,
    inProgress: 5,
    resolved: 7,
  };

  const filters = ['All', 'In Progress', 'Resolved', 'Submitted'];

  const reports = [
    {
      id: 1,
      title: 'Large Pothole',
      location: 'Main St & 2nd Ave',
      status: 'In Progress',
      date: 'Oct 28',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoLOLUwJeoLkZc2pY8A6EpvlqqMYpFQzS8jQ1Tx5FjeQU4Tid44nHtuCQpINZcQR-317tr_N4-o0MDCXZv1uLkxmzxxbUuNF7Bm0ePcCsxzBorcvY-N0GmJaHa0XiwGaOu6K2TUNLIcncIBBpOUYC4Bopoqr5geTJMrn00K2fFzPUNkdzQBqmPUjb3Qch_vRapxE99tMV43KunIQl290u62Bv761ejK76KqGk0dsYa3bf0DdhYxYweRbW2fIkRv0vqKT8IZdKzUYDH',
      alt: 'Close-up of a large pothole on an asphalt road.',
    },
    {
      id: 2,
      title: 'Overflowing Bin',
      location: 'Corner of Park Ave',
      status: 'Resolved',
      date: 'Oct 22',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZMc_W07EK6HtNYHPvlpYoj8Fo6q4qR7SXBS3FArdmdGNPe5tMwF-YT4-uuIucDKEijNYi1RJM6lQQNok3opV3xzddt0RodAGPNbSdOWazU1hl289H2UYFircTrFyA3wjbISqW9aKoghspkTcwtk2vWVw0jnDsku07SsuWB09HcKPYvwnI6R7r3HGZ-rUvzvwhEjXrMtb2-Qy4yBzSMcZ2NJM85kNDvC2xdzcLDhQxriPRYkYazZrvoB3yVBv26JZAcRryKV_GPGW9',
      alt: 'An overflowing public trash bin on a city sidewalk.',
    },
    {
      id: 3,
      title: 'Graffiti on Wall',
      location: 'Riverfront Walkway',
      status: 'Submitted',
      date: 'Oct 19',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCq23SuHWuRh1n62RlwiAZogVoa9MA3pUnyxbSBdKkwnn7T6Jkw7kyilA7IfSE8D2k-7Edeid2IkLkVIvKnYid-YgbEH4h6S6g_6K9H6bJsoNyvrMkg5N0CJkKang8L6SR_CadnTeZ50QQguXNLJ86rSUAepc6Yx4soBi5sRNZtIjvNeGLraHdcquITKmMhe191qyBUJ3rMC1XXRKaH8TtbaqxvtoEjvlYMbaOaeJP9DZO1APwTGDiMVeg9dfjlbDB7gVRUx7R_ipM',
      alt: 'Graffiti spray-painted on a brick wall.',
    },
    {
      id: 4,
      title: 'Broken Streetlight',
      location: 'Elm Street, 301',
      status: 'Rejected',
      date: 'Oct 15',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGBtkvAdPK3DlwHhV7Vurw6GY8BteSIKaVJIQCETi_acrQVUKsPA9mJpsxvD0XQAS5f7GQpTRZGId975-obp-tGQFAYlKvqyBJg---zSP_ueV3NR6sYmL6la4oEDzTsQFHoX9LCk7Gb3dXBh52UkQcTtcFjdVdHmaaDwBTrOY-2aO2UVBUNxITbhDjwzkNZPfX8cCoIiawwFerTWRuF47OXAv4OCzySwV9yzj70iKi8im2m04KfqrHwUyzy7LtP4lFFMnytHwKweOn',
      alt: 'A broken street light during the day.',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-primary/10 text-primary';
      case 'Resolved':
        return 'bg-success/10 text-success';
      case 'Submitted':
        return 'bg-warning/10 text-warning';
      case 'Rejected':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredReports = activeFilter === 'All' 
    ? reports 
    : reports.filter(report => report.status === activeFilter);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center border-b border-border-light bg-background-light/80 p-4 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
          My Reports
        </h1>
        <div className="size-10 shrink-0"></div>
      </header>




      <main className="flex-1 space-y-6 p-4 pb-24">
        {/* Stats Section */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1.5 rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark">
            <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
              Total Reports
            </p>
            <p className="text-3xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary">
              {stats.total}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark">
            <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
              In Progress
            </p>
            <p className="text-3xl font-bold tracking-tight text-primary">
              {stats.inProgress}
            </p>
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark md:col-span-1">
            <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
              Resolved
            </p>
            <p className="text-3xl font-bold tracking-tight text-success">
              {stats.resolved}
            </p>
          </div>
        </section>

        {/* Filter Chips */}
        <section>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-card-light shadow-sm dark:bg-card-dark'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    activeFilter === filter
                      ? 'text-white'
                      : 'text-text-light-primary dark:text-text-dark-primary'
                  }`}
                >
                  {filter}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Report List */}
        <section className="space-y-4">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 rounded-xl bg-card-light p-3 shadow-sm dark:bg-card-dark cursor-pointer hover:shadow-md transition-shadow"
              >
                <div
                  className="aspect-square size-20 shrink-0 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url("${report.image}")` }}
                  aria-label={report.alt}
                />
                <div className="flex-1">
                  <p className="font-bold text-text-light-primary dark:text-text-dark-primary">
                    {report.title}
                  </p>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    {report.location}
                  </p>
                  <div
                    className={`mt-1 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 ${getStatusColor(
                      report.status
                    )}`}
                  >
                    <p className="whitespace-nowrap text-xs font-medium">
                      {report.status}
                    </p>
                  </div>
                </div>
                <p className="self-start text-xs text-text-light-secondary dark:text-text-dark-secondary">
                  {report.date}
                </p>
              </div>
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-light bg-card-light p-12 text-center dark:border-border-dark dark:bg-card-dark">
              <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary">
                add_location_alt
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                No Reports Yet
              </h3>
              <p className="mt-1 max-w-xs text-sm text-text-light-secondary dark:text-text-dark-secondary">
                See an issue in your community? Tap the &apos;+&apos; button to make your first report.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
}