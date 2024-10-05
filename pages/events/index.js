import { redirect } from "react-router-dom";
import EventsSearch from "../../components/events-search";
import EventList from "../../components/events/event-list";
import { useRouter } from "next/router";
import { getAllEvents } from "../../helpers/api-util";
import Head from "next/head";

const AllEventsPage = (props) => {
  const router = useRouter();
  const { events } = props;
  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }
  return (
    <div>
      <Head>
        <title>All events</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve..."
        />
      </Head>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </div>
  );
};

export async function getStaticProps() {
  const events = await getAllEvents();
  return {
    props: {
      events: events,
    },
    revalidate: 60,
  };
}
export default AllEventsPage;
