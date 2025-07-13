import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PaidWarningBannerForm() {
  return (
    <Banner
      type="info"
      title="Want to create paid events?"
      message={
        <>
          Schedule a meeting with our team to get organizer verification and
          unlock paid ticketing features.
        </>
      }
    >
      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm" asChild>
          <Link
            href="mailto:info@usetroptix.com?subject=Organizer Verification Request"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Support
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2WEgtuwexAzT6QOpQIiwK2PhMfJcPzu8E8T2zbXUAeU79qA_9KJiWbSIb9ddCgFD78gLrx9F0R"
            target="_blank"
            rel="noopener noreferrer"
          >
            Schedule Meeting
          </Link>
        </Button>
      </div>
    </Banner>
  );
}

export function PaidWarningBannerOrganizer() {
  return (
    <Banner
      type="info"
      title="Schedule a Meeting to Unlock Paid Events"
      message={
        <div className="space-y-2">
          <p>
            You can create unlimited free events right now. To create paid
            events, you&apos;ll need to schedule a meeting with our team.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href="mailto:info@usetroptix.com?subject=Organizer Verification Request"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2WEgtuwexAzT6QOpQIiwK2PhMfJcPzu8E8T2zbXUAeU79qA_9KJiWbSIb9ddCgFD78gLrx9F0R"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schedule Meeting
              </Link>
            </Button>
          </div>
        </div>
      }
    />
  );
}
