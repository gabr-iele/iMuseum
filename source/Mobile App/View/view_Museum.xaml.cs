using System;
using System.Collections.Generic;
using Xamarin.Forms;
using iMuseum.Model;
using System.Diagnostics;

namespace iMuseum.View
{
    public partial class view_Museum : ContentView
    {
        Museum current;
        view_Visit visitView;
        DemoVisit demo;



        public view_Museum(Museum toDisplay)
        {
            InitializeComponent();
            this.BindingContext = current = toDisplay;
        }

        private void removeStartDemoButton() { this.demo_visit_button.IsVisible = false; }
        private void removeStartVisitButton() { this.start_visit_button.IsVisible = false;}

        private void showStartDemoButton() { this.demo_visit_button.IsVisible = true; }
        private void showStartVisitButton() { this.start_visit_button.IsVisible = true; }



        /// <summary>
        /// Create a view to display the current visit.
        /// </summary>
        /// @author Gabriele Ursini
        private void createVisitView(Visit visit) {
            visitView = new view_Visit(visit) { AutomationId="visitView"};
            this.globalStack.Children.Add(visitView) ;
        }


        /// <summary>
        /// Hide the visit view once the visit is over.
        /// </summary>
        /// @author Gabriele Ursini
        private void hideVisitView() {
            if (visitView != null) {
                try
                {
                    this.globalStack.Children.Remove(visitView);
                    visitView = null;
                }
                catch (Exception e) { Debug.WriteLine(e); }
            }
        }

        /// <summary>
        /// Handle the start of the visit.
        /// </summary>
        /// @author Gabriele Ursini
        async void handleVisit(Object sender, EventArgs e)
        {
            if (!current.isThereAVisitInProgress)
            {

                var startRequest = await current.startVisitAsync();
                if (!startRequest.isSuccessFull()) {
                    await App.mainPage.DisplayAlert("Error", startRequest.message, "Ok");
                    return;
                }
                removeStartDemoButton();
                this.start_visit_button.Text = "End Visit";
                this.createVisitView(current.current);
            }
            else
            {

                var endRequest = await current.endVisitAsync();
                if (!endRequest.isSuccessFull()) {
                    await App.mainPage.DisplayAlert("Error", endRequest.message, "Ok");
                    return;
                }

                this.showStartDemoButton();
                this.start_visit_button.Text = "Start a Visit";
                this.hideVisitView();
            }
        }

        /// <summary>
        /// Handle the start of a demo visit.
        /// </summary>
        /// @author Gabriele Ursini
        async void handleDemoVisit(Object sender, EventArgs e)
        {
          
            if (demo == null)
            {
                removeStartVisitButton();
                demo = new DemoVisit(current);
                this.demo_visit_button.Text = "End Demo Visit";
                this.createVisitView(demo);
                await demo.startSimulationAsync();

            }
            else {
                demo.stop();
                this.showStartVisitButton();
                this.demo_visit_button.Text = "Start Demo Vist";
                this.hideVisitView();
            }
        }
    }
}
