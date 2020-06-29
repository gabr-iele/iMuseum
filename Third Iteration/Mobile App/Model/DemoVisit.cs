using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace iMuseum.Model
{
    public class DemoVisit : Visit
    {

        List<string> availableSensors = new List<string>();
        List<string> seenSensors = new List<string>();

        private string DEFAULT_MUSEUM_ID = "3a1e0ca8-0d61-4d79-8652-cd92eabb0547";

        private bool can_visit_have_loop = false;
        private bool shouldStop = false; // for stopping the visit from outside the object

      

        public event EventHandler sensorDetected;
        private Random random = new Random();


        public DemoVisit(Museum parent) : base(parent)
        {
            base.parent = parent;
            base.parent.current = this;
        }

        /// <summary>
        /// Check if the simulated visit should continue.
        /// </summary>
        /// @author Gabriele Ursini
        public bool isSimulatedVisitOver()
        {
            foreach (string sensorID in availableSensors)
            {
                if (!seenSensors.Contains(sensorID)) return false || shouldStop;
            }

            return true || shouldStop;
        }

        /// <summary>
        /// Check if the visit will have loops.
        /// </summary>
        /// @author Gabriele Ursini
        private void determineIfLoop()
        {
            can_visit_have_loop = random.Next(2) == 1;
        }


        /// <summary>
        /// Get the next sensor ID to visit.
        /// </summary>
        /// @author Gabriele Ursini
        private string getNextSensorID()
        {
            if (can_visit_have_loop)
            {
                int random_index = random.Next(availableSensors.Count);
                return availableSensors[random_index];
            }
            else
            {

                List<String> remain = new List<string>();

                foreach (string sensorID in availableSensors) {
                    if (!seenSensors.Contains(sensorID)) { remain.Add(sensorID); }
                }

                int random_index = random.Next(remain.Count);
                return availableSensors[random_index];
            }
        }


        /// <summary>
        ///Stop a simulated visit
        /// </summary>
        /// @author Gabriele Ursini
        public void stop() {
            this.shouldStop = true;
        }


        /// <summary>
        ///Start a simulated visit.
        /// </summary>
        /// @author Gabriele Ursini
        public async Task<PersistanceStorage.PersistanceStorage.persistanceStorageWrapper> startSimulationAsync()
        {

            var defaultMuseumRequest = await PersistanceStorage.PersistanceStorage.Instance.getMuseumFromIDAsync(DEFAULT_MUSEUM_ID);
            if (!defaultMuseumRequest.isSuccessFull())
            {
                return defaultMuseumRequest;
            }

            base.parent = defaultMuseumRequest.getMuseum();
            var startRequest = await base.parent.startVisitAsync();

            if (!startRequest.isSuccessFull())
            {
                return startRequest;
            }

            this.start = startRequest.getVisit(base.parent).start;
            this.ID = startRequest.getVisit(base.parent).ID;
            base.parent.current = this;

            App.getMainPage().setCurrentMuseumForDemo(base.parent);

            this.determineIfLoop();
            availableSensors = base.parent.getAllSensorID();


            Debug.WriteLine("Demo visit started...");

            if (this.can_visit_have_loop) Debug.WriteLine("The visit will have loops.");
            else { Debug.WriteLine("The visit will be without loops."); }


            while (!isSimulatedVisitOver())
            {
                await Task.Delay(2000);
                String nextSensor = getNextSensorID();
                Debug.WriteLine("I am approaching sensor " + nextSensor + " I've seen: ");
                foreach (String ID in this.seenSensors) {
                    Debug.WriteLine(ID);
                }

                this.seenSensors.Add(nextSensor);
                await App.getMainPage().getPieceFromSensor(nextSensor);
                await Task.Delay(4000);
            }

            return await base.parent.endVisitAsync();

        }

    
    }
}
