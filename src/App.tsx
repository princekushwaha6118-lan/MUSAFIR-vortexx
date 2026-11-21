import React, { useCallback, useEffect, useState } from 'react';
import { DestinationsSection } from './components/DestinationsSection.tsx';
import { ExploreIndiaSection } from './components/ExploreIndiaSection.tsx';
import { FooterSection } from './components/FooterSection.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { IndiaPlaceModal } from './components/IndiaPlaceModal.tsx';
import { Navbar } from './components/Navbar.tsx';
import { PackagesSection } from './components/PackagesSection.tsx';
import { PlaceSearchModal } from './components/PlaceSearchModal.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { TravelSoundtrackSection } from './components/TravelSoundtrackSection.tsx';
import {
  AuthModal,
  BookingModal,
  DestinationModal,
} from './components/WanderlyModals.tsx';
import { WhyChooseUsSection } from './components/WhyChooseUsSection.tsx';
import {
  DESTINATIONS,
  FEATURED_PACKAGES,
  TESTIMONIALS,
  formatINR,
} from './data/travelData.ts';
import type {
  BookingRecord,
  DestinationRegion,
  IndiaStateUT,
  MusafirDestination,
  TravelPackage,
  UserSession,
  ValuePriority,
} from './types.ts';

export default function App() {
  // Search & filter state
  const [destinationQuery, setDestinationQuery] = useState('all');
  const [activeRegion, setActiveRegion] = useState<DestinationRegion>('All');
  const [checkIn, setCheckIn] = useState('2027-06-12');
  const [checkOut, setCheckOut] = useState('2027-06-19');
  const [travelers, setTravelers] = useState(2);
  const [maxBudgetInr, setMaxBudgetInr] = useState<number | null>(null);
  const [valuePriority, setValuePriority] = useState<ValuePriority>('balanced');
  const [searching, setSearching] = useState(false);

  // Interactive modals & user session
  const [user, setUser] = useState<UserSession | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [exploredDestination, setExploredDestination] =
    useState<MusafirDestination | null>(null);
  const [selectedIndiaPlace, setSelectedIndiaPlace] =
    useState<IndiaStateUT | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPackage, setBookingPackage] = useState<TravelPackage | null>(
    null
  );
  const [bookingCustomPlace, setBookingCustomPlace] = useState<{
    name: string;
    priceInr: number;
  } | null>(null);
  const [bookingDestId, setBookingDestId] = useState('agra-taj');
  const [lastVisitedPlaceName, setLastVisitedPlaceName] = useState<string | undefined>(
    undefined
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((curr) => (curr === message ? null : curr));
    }, 3600);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchTrips = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setActiveRegion('All');
    window.setTimeout(() => {
      setSearching(false);
      scrollToSection(maxBudgetInr !== null && destinationQuery === 'all' ? 'explore-india' : 'destinations');
      const selected = DESTINATIONS.find((d) => d.id === destinationQuery);
      const budgetNote =
        maxBudgetInr !== null ? ` under ${formatINR(maxBudgetInr)}` : '';
      showToast(
        selected
          ? `Showing curated escapes for ${selected.name}${budgetNote} (${travelers} ${
              travelers === 1 ? 'traveler' : 'travelers'
            }).`
          : `Showing trips${budgetNote} for ${travelers} ${
              travelers === 1 ? 'traveler' : 'travelers'
            }.`
      );
    }, 360);
  };

  const matchingDestinationsCount = DESTINATIONS.filter(
    (d) => maxBudgetInr === null || d.startingPriceInr <= maxBudgetInr
  ).length;
  const matchingPackagesCount = FEATURED_PACKAGES.filter(
    (p) => maxBudgetInr === null || p.pricePerGuestInr <= maxBudgetInr
  ).length;

  const handleOpenBookingForDest = (dest: MusafirDestination) => {
    setExploredDestination(null);
    setBookingCustomPlace(null);
    setBookingPackage(
      FEATURED_PACKAGES.find((p) => p.destinationId === dest.id) ?? null
    );
    setBookingDestId(dest.id);
    setBookingOpen(true);
  };

  const handleOpenBookingForIndiaPlace = (place: IndiaStateUT) => {
    setSelectedIndiaPlace(null);
    setBookingPackage(null);
    setBookingCustomPlace({
      name: place.name,
      priceInr: place.startingBudgetInr,
    });
    setBookingOpen(true);
  };

  const handleOpenBookingForPkg = (pkg: TravelPackage) => {
    setBookingCustomPlace(null);
    setBookingPackage(pkg);
    setBookingDestId(pkg.destinationId);
    setBookingOpen(true);
  };

  const handleBookingSuccess = (booking: BookingRecord) => {
    showToast(`Trip reserved (${booking.id}) for ${booking.destinationName}.`);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#141714]">
      <Navbar
        user={user}
        onNavigate={scrollToSection}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={() => {
          setUser(null);
          showToast('Signed out of MUSAFIR.');
        }}
        onBookTrip={() => {
          setBookingCustomPlace(null);
          setBookingPackage(null);
          setBookingDestId(
            destinationQuery === 'all' ? 'agra-taj' : destinationQuery
          );
          setBookingOpen(true);
        }}
      />

      <main>
        <HeroSection
          destinations={DESTINATIONS}
          destinationQuery={destinationQuery}
          checkIn={checkIn}
          checkOut={checkOut}
          travelers={travelers}
          maxBudgetInr={maxBudgetInr}
          searching={searching}
          onDestinationQueryChange={setDestinationQuery}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          onTravelersChange={setTravelers}
          onMaxBudgetChange={setMaxBudgetInr}
          onSearchTrips={handleSearchTrips}
        />

        <DestinationsSection
          destinations={DESTINATIONS}
          activeRegion={activeRegion}
          selectedSearchDest={destinationQuery}
          maxBudgetInr={maxBudgetInr}
          valuePriority={valuePriority}
          onValuePriorityChange={setValuePriority}
          onRegionChange={setActiveRegion}
          onClearSearchFilter={() => setDestinationQuery('all')}
          onResetBudget={() => setMaxBudgetInr(null)}
          onExploreDestination={(dest) => {
            setExploredDestination(dest);
            setLastVisitedPlaceName(dest.name);
          }}
        />

        <ExploreIndiaSection
          maxBudgetInr={maxBudgetInr}
          onBudgetChange={setMaxBudgetInr}
          matchingDestinationsCount={matchingDestinationsCount}
          matchingPackagesCount={matchingPackagesCount}
          valuePriority={valuePriority}
          onOpenPlace={(place) => {
            setSelectedIndiaPlace(place);
            setLastVisitedPlaceName(place.name);
          }}
        />

        <TravelSoundtrackSection
          activePlaceName={
            selectedIndiaPlace?.name ??
            exploredDestination?.name ??
            lastVisitedPlaceName
          }
        />

        <PackagesSection
          packages={FEATURED_PACKAGES}
          selectedSearchDest={destinationQuery}
          maxBudgetInr={maxBudgetInr}
          onResetBudget={() => setMaxBudgetInr(null)}
          onBookPackage={handleOpenBookingForPkg}
        />

        <WhyChooseUsSection />

        <TestimonialsSection testimonials={TESTIMONIALS} />
      </main>

      <FooterSection
        destinations={DESTINATIONS}
        onNavigate={scrollToSection}
        onSelectDestination={(dest) => setExploredDestination(dest)}
      />

      {/* Modals */}
      <DestinationModal
        key={exploredDestination?.id ?? 'closed'}
        destination={exploredDestination}
        valuePriority={valuePriority}
        onClose={() => setExploredDestination(null)}
        onBookDestination={handleOpenBookingForDest}
      />

      <IndiaPlaceModal
        key={selectedIndiaPlace?.id ?? 'india-closed'}
        place={selectedIndiaPlace}
        valuePriority={valuePriority}
        onClose={() => setSelectedIndiaPlace(null)}
        onPlanTrip={handleOpenBookingForIndiaPlace}
      />

      <BookingModal
        key={`${bookingOpen}-${bookingDestId}-${bookingPackage?.id ?? 'none'}-${bookingCustomPlace?.name ?? 'std'}`}
        open={bookingOpen}
        destinations={DESTINATIONS}
        packages={FEATURED_PACKAGES}
        initialDestinationId={bookingDestId}
        initialPackage={bookingPackage}
        initialCustomPlace={bookingCustomPlace}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialTravelers={travelers}
        user={user}
        onClose={() => setBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(signedIn) => {
          setUser(signedIn);
          showToast(`Welcome to MUSAFIR, ${signedIn.name}.`);
        }}
      />

      <PlaceSearchModal
        open={searchOpen}
        valuePriority={valuePriority}
        onClose={() => setSearchOpen(false)}
        onSelectDestination={(dest) => {
          setExploredDestination(dest);
          setLastVisitedPlaceName(dest.name);
        }}
        onSelectIndiaPlace={(place) => {
          setSelectedIndiaPlace(place);
          setLastVisitedPlaceName(place.name);
        }}
        onSelectPackage={(pkg) => {
          handleOpenBookingForPkg(pkg);
        }}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#141714] text-white px-5 py-3 rounded-full text-xs sm:text-sm font-medium shadow-xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
