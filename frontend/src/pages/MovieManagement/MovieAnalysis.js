import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff' 
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000', 
    textAlign: 'left' 
  },
  centeredHeading: {
    textAlign: 'center' 
  },
  normalText: {
    fontSize: 12,
    marginBottom: 3,
    color: '#000000' 
  },
  bulletPoint: {
    fontSize: 12,
    marginBottom: 3,
    color: '#000000', 
    marginLeft: 10 
  },
  table: {
    border: '1 solid black', 
    marginBottom: 15
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000', 
    alignItems: 'center'
  },
  tableCell: {
    width: '25%',
    padding: 5,
    fontSize: 12, 
    borderRightWidth: 1, 
    borderRightColor: '#000000' 
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 12
  }
});

// Create PDF document component
const PdfDocument = ({ movieReport }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={[styles.heading, styles.centeredHeading]}>
            {'\n'} 
            Movie Analysis
          </Text>
          <Text style={styles.normalText}>Total Scheduling: {movieReport.totalMoviesScheduled}</Text>
          <Text style={styles.normalText}>Movies Scheduled Today: {movieReport.moviesScheduledToday.length}</Text>
          <Text style={styles.normalText}>Movies Scheduled Upcoming: {movieReport.moviesScheduledUpcoming.length}</Text>
          
          <Text style={styles.heading}>
            {'\n'}
            Movies with Most Showtimes:
          </Text>
          <View>
            {movieReport.moviesWithMostShowtimes.map(movie => (
              <Text key={movie.movie} style={styles.bulletPoint}>• {movie.movie}: {movie.totalShowtimes}</Text>
            ))}
          </View>
          
          <Text style={styles.heading}>
            {'\n'} 
            Movies with Fewest Showtimes:
          </Text>
          <View>
            {movieReport.moviesWithFewestShowtimes.map(movie => (
              <Text key={movie.movie} style={styles.bulletPoint}>• {movie.movie}: {movie.totalShowtimes}</Text>
            ))}
          </View>
          
          <Text style={styles.heading}>
            {'\n'}{'\n'} 
            Movie Schedule Overview
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>No</Text></View>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>Movie</Text></View>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>Date</Text></View>
              <View style={[styles.tableCell, styles.tableHeader]}><Text>Time</Text></View>
            </View>
            {movieReport.movieScheduleOverview.map((schedule, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>{schedule.movie}</Text>
                <Text style={styles.tableCell}>{formatDate(schedule.date)}</Text>
                <Text style={styles.tableCell}>{schedule.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;
