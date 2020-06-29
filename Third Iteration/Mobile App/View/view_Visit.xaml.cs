using System;
using System.Collections.Generic;
using Xamarin.Forms;
using iMuseum.Model;

namespace iMuseum.View
{
    public partial class view_Visit : ContentView
    {
        Visit current;
        public view_Visit(Visit current)
        {
            InitializeComponent();
            this.current = current;


            this.current.pieceSeen += HandlePieceSeen;
            this.createTimer();
        }

        /// <summary>
        /// Display every second the visit duration
        /// </summary>
        /// @author Gabriele Ursini
        public void createTimer() {
            Device.StartTimer(TimeSpan.FromSeconds(1), () =>
            {
                Device.InvokeOnMainThreadAsync(() =>
                {
                    this.visit_elapse_lbl.Text = current.getElapsedTime;
                });

                return true;
            });
        }


        /// <summary>
        /// A a piece to the list of seen during the current visi.
        /// </summary>
        /// @author Gabriele Ursini
        public void addSeenPiece(Piece piece) {
            this.current.addPieceToList(piece);
           
        }

        /// <summary>
        /// Handle a new piece seen during the current visit.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void HandlePieceSeen(object sender, EventArgs e) {
            this.piece_visit_counter.Text = this.current.getVisitProgress;
        }
    }
}
