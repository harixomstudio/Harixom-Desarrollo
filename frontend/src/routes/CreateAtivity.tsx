import { createFileRoute } from '@tanstack/react-router'
import CreateActivity from '../components/pages/CreateActivityPage';

export const Route = createFileRoute('/CreateAtivity')({
    component: RouteComponent,
})
const types = ["Workshop", "Taller", "Challenge"]
function RouteComponent() {
    return (
        <CreateActivity
            Event="Create a Event"
            Type='Type'
            AllTypes={types}
            dateStart="Launch date"
            timeStart="Start time"
            title="Title"
            description="Description"
            dateEnd="Finish date"
            timeEnd="End time"

        />);
}