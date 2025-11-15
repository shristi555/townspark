import React from "react";

const HomePage = () => {
  const reports = [
    {
      id: 1,
      category: "Road Damage",
      categoryColor: "orange",
      title: "Large Pothole on Main St",
      status: "Reported",
      statusColor: "orange",
      location: "Near City Hall, 123 Main St",
      timeAgo: "2 days ago",
      likes: 15,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGDRcQfE90rTrAjxQZai_cdhDmAyIDfGlrhtY-VQIWDEJKmyU-ICrHeqAD7oSuptSUYVN88W8oV-n_wl-OuZFQdpHiLTHhqA9P0bCZ0mEbHtL1Hmzcx1F4raCtTkm4-4RDw_Zs_99Tc7g3130UJL6oilDUxJrBHtGRdQFMtgpGTo6qyybr8wr5EdJ7bNL_Qcktzhrw9QiH5AK4LZCnh7IR0zReZBl9sHaJ1slyHsHGNVQW0EtvbOWfOip42TCKrKdXP-Zm3YipekS",
      imageAlt: "A large, deep pothole on an asphalt street next to a curb.",
    },
    {
      id: 2,
      category: "Waste Management",
      categoryColor: "blue",
      title: "Overflowing Garbage Can",
      status: "In Progress",
      statusColor: "blue",
      location: "Oak Street Park Entrance",
      timeAgo: "5 days ago",
      likes: 8,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPfAz_4SJuq5JxbB9Tn-CagjmZu-Jc-uKSd7uqYTdQbL9VwgiZYvLtWUVw9Fj68LbE4WRuyg7Hng0DXOd4e7j7j_dyKqlbMC4VwH0btHUm9ZlNMGqFWFcGgBclcNcIDB1VNKa2xajsNHYN0cLVjRX4ThmA8ki3hygTlRaQw1jzbP0qRRV29pN3fDgNrT7qmd_2eXQ-rZhGlxKyPuvfdfbYz4Od0PDbY2Xeh--jUgTprH9GyTEtYZOsbswHdoHsng2_WTtSet-UuxMh",
      imageAlt:
        "An overflowing public trash can in a park with litter on the ground around it.",
    },
    {
      id: 3,
      category: "Infrastructure",
      categoryColor: "green",
      title: "Broken Sidewalk",
      status: "Resolved",
      statusColor: "green",
      location: "45 Pine Avenue",
      timeAgo: "1 week ago",
      likes: 23,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2oqAEfSbQezszaqYtEZsUDsvxtf4Pb6EOQclNKwp0Ak5cqrSbJ72NVuPVGZdnMkThr8laStbvRridY8hhSqgh1ZHW_87AG-cE7NBpRW1rc3sJYFUAEiQo_6Sma43hHOiSSN0KzffBRA5-0hMrG4M0fwkaETdXpkLEFDGlRM-XUy3kMC7XNcC4jnEBklIIzXBPSwzMakv8iOS1xlODrz8iAWBgHyWl_QE_IamUnCS46FxEAYIyfdmEbt6spaL5AYZ5tc99VgPx7Hcp",
      imageAlt:
        "A cracked and uneven sidewalk with raised sections creating a tripping hazard.",
    },
    {
      id: 4,
      category: "Brain damage",
      categoryColor: "green",
      title: "Severe Brain Injury Case",
      status: "Under Review",
      statusColor: "blue",
      location: "General Hospital, 789 Health St",
      timeAgo: "3 days ago",
      likes: 30,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGDRcQfE90rTrAjxQZai_cdhDmAyIDfGlrhtY-VQIWDEJKmyU-ICrHeqAD7oSuptSUYVN88W8oV-n_wl-OuZFQdpHiLTHhqA9P0bCZ0mEbHtL1Hmzcx1F4raCtTkm4-4RDw_Zs_99Tc7g3130UJL6oilDUxJrBHtGRdQFMtgpGTo6qyYybr8wr5EdJ7bNL_Qcktzhrw9QiH5AK4LZCnh7IR0zReZBl9sHaJ1slyHsHGNVQW0EtvbOWfOip42TCKrKdXP-Zm3YipekS",

      imageAlt: "MRI scan showing areas of brain damage.",
    },
  ];

  const getCategoryColorClass = (color) => {
    const colors = {
      orange: "text-orange-500",
      blue: "text-blue-500",
      green: "text-green-600",
    };
    return colors[color] || "text-gray-600";
  };

  const getStatusColorClass = (color) => {
    const colors = {
      orange: "bg-orange-100 text-orange-600",
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
    };
    return colors[color] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Community Reports</h1>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-600 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-2xl">
              filter_list
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        <div className="mx-auto max-w-2xl space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="overflow-hidden rounded-2xl bg-white shadow-md"
            >
              {/* Image */}
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${report.image}")` }}
                role="img"
                aria-label={report.imageAlt}
              ></div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium mb-1 ${getCategoryColorClass(
                        report.categoryColor
                      )}`}
                    >
                      {report.category}
                    </p>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                      {report.title}
                    </h2>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${getStatusColorClass(
                      report.statusColor
                    )}`}
                  >
                    {report.status}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="material-symbols-outlined text-lg">
                    location_on
                  </span>
                  <span>{report.location}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="material-symbols-outlined text-lg">
                      schedule
                    </span>
                    <span>{report.timeAgo}</span>
                  </div>
                  <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      thumb_up
                    </span>
                    <span className="text-sm font-semibold">
                      {report.likes}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default HomePage;
