import React, { useState } from 'react';
import './PlantationDrives.css';

const plantationDrives = [
    {
        id: 1,
        title: "Billion Tree Tsunami - KPK",
        location: "Khyber Pakhtunkhwa",
        description: "Massive reforestation drive across KPK province targeting degraded forest lands and urban areas.",
        date: "March 15, 2024 - Ongoing",
        targetTrees: "1,000,000,000",
        status: "active",
        website: "https://www.facebook.com/BillionTreeTsunamiKPK",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop"
    },
    {
        id: 2,
        title: "Clean Green Pakistan - Islamabad",
        location: "Islamabad Capital Territory",
        description: "Urban forestry initiative focusing on creating green belts and parks in the federal capital.",
        date: "April 10, 2024 - Ongoing",
        targetTrees: "500,000",
        status: "active",
        website: "https://www.facebook.com/CleanGreenPakistan",
        image: "https://images.unsplash.com/photo-1574263867128-ea4c1f3bb5ab?w=400&h=200&fit=crop"
    },
    {
        id: 3,
        title: "Punjab Forest Department Drive",
        location: "Punjab Province",
        description: "Statewide plantation campaign targeting agricultural lands and urban centers across Punjab.",
        date: "February 20, 2024 - December 2024",
        targetTrees: "50,000,000",
        status: "active",
        website: "https://www.forests.punjab.gov.pk",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop"
    },
    {
        id: 4,
        title: "Sindh Coastal Mangrove Project",
        location: "Sindh Coast",
        description: "Mangrove restoration along Sindh's coastline to combat erosion and support marine ecosystems.",
        date: "January 5, 2024 - Ongoing",
        targetTrees: "2,000,000",
        status: "active",
        website: "https://www.sindhforests.gov.pk",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop"
    },
    {
        id: 5,
        title: "Balochistan Desert Afforestation",
        location: "Balochistan Province",
        description: "Desert reclamation through drought-resistant tree species plantation in arid regions.",
        date: "May 1, 2024 - March 2025",
        targetTrees: "5,000,000",
        status: "active",
        website: "https://www.balochistan.gov.pk/forestry",
        image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=200&fit=crop"
    },
    {
        id: 6,
        title: "Karachi Metropolitan Greening",
        location: "Karachi, Sindh",
        description: "Urban tree plantation initiative to improve air quality in Pakistan's largest city.",
        date: "March 25, 2024 - Ongoing",
        targetTrees: "1,000,000",
        status: "active",
        website: "https://www.kmc.gos.pk/green-karachi",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop"
    },
    {
        id: 7,
        title: "Lahore Smart City Forests",
        location: "Lahore, Punjab",
        description: "Smart urban forestry using IoT sensors for monitoring tree health and growth in Lahore.",
        date: "June 10, 2024 - December 2024",
        targetTrees: "750,000",
        status: "upcoming",
        website: "https://www.lahore.gov.pk/smart-forests",
        image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=400&h=200&fit=crop"
    },
    {
        id: 8,
        title: "Gilgit-Baltistan Highland Trees",
        location: "Gilgit-Baltistan",
        description: "High-altitude tree plantation focusing on climate-adapted species in northern regions.",
        date: "July 15, 2024 - September 2024",
        targetTrees: "300,000",
        status: "upcoming",
        website: "https://www.gilgitbaltistan.gov.pk/forestry",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
    },
    {
        id: 9,
        title: "Peshawar Green Ring Project",
        location: "Peshawar, KPK",
        description: "Creating a green belt around Peshawar city to reduce urban heat and improve air quality.",
        date: "August 1, 2024 - February 2025",
        targetTrees: "800,000",
        status: "upcoming",
        website: "https://www.peshawar.gov.pk/green-ring",
        image: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400&h=200&fit=crop"
    },
    {
        id: 10,
        title: "AJK Forest Revival Initiative",
        location: "Azad Jammu & Kashmir",
        description: "Comprehensive forest restoration program in AJK focusing on watershed management.",
        date: "September 10, 2024 - June 2025",
        targetTrees: "1,500,000",
        status: "upcoming",
        website: "https://www.ajk.gov.pk/forests",
        image: "https://images.unsplash.com/photo-1618221636279-6e3bb0f3f7aa?w=400&h=200&fit=crop"
    }
];

const PlantationDrives = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDrives, setFilteredDrives] = useState(plantationDrives);
    const drivesPerPage = 6;

    const formatNumber = (num) => {
        const number = parseInt(num.replace(/,/g, ''));
        if (number >= 1000000000) {
            return (number / 1000000000).toFixed(1) + 'B';
        } else if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    };

    const joinDrive = (driveId) => {
        const drive = plantationDrives.find(d => d.id === driveId);
        if (drive) {
            alert(`Thank you for joining "${drive.title}"!\n\nYou will receive further details via email soon.`);
        }
    };

    const filterDrives = (status) => {
        if (status === 'all') {
            setFilteredDrives(plantationDrives);
        } else {
            setFilteredDrives(plantationDrives.filter(drive => drive.status === status));
        }
        setCurrentPage(1);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredDrives.length / drivesPerPage);
    const startIndex = (currentPage - 1) * drivesPerPage;
    const currentDrives = filteredDrives.slice(startIndex, startIndex + drivesPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="plantation-drives-container">
            <header className="drives-header">
                <h1>Active Plantation Drives in Pakistan</h1>
                <p>Join nationwide tree planting initiatives across the country</p>
            </header>

            <div className="filter-buttons">
                <button 
                    className={`filter-btn ${filteredDrives.length === plantationDrives.length ? 'active' : ''}`}
                    onClick={() => filterDrives('all')}
                >
                    All Drives
                </button>
                <button 
                    className={`filter-btn ${filteredDrives.length !== plantationDrives.length && filteredDrives[0]?.status === 'active' ? 'active' : ''}`}
                    onClick={() => filterDrives('active')}
                >
                    Active
                </button>
                <button 
                    className={`filter-btn ${filteredDrives.length !== plantationDrives.length && filteredDrives[0]?.status === 'upcoming' ? 'active' : ''}`}
                    onClick={() => filterDrives('upcoming')}
                >
                    Upcoming
                </button>
            </div>

            <div className="drives-grid">
                {currentDrives.map(drive => (
                    <div key={drive.id} className="drive-card">
                        <img src={drive.image} alt={drive.title} className="drive-image" />
                        <div className="drive-content">
                            <div className={`status-badge status-${drive.status}`}>
                                {drive.status.toUpperCase()}
                            </div>
                            <h3 className="drive-title">{drive.title}</h3>
                            <p className="drive-location">{drive.location}</p>
                            <p className="drive-description">{drive.description}</p>
                            <div className="drive-details">
                                <span className="drive-date">{drive.date}</span>
                                <span className="drive-trees">{formatNumber(drive.targetTrees)} trees</span>
                            </div>
                            <div className="drive-actions">
                                <button 
                                    className="join-btn"
                                    onClick={() => joinDrive(drive.id)}
                                >
                                    Join Drive
                                </button>
                                <a 
                                    href={drive.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="website-btn"
                                >
                                    🌐 Visit
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="pagination-btn"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button 
                        className="pagination-btn"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlantationDrives;