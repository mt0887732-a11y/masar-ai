import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// تسجيل خط Cairo لدعم التشفير العربي
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvamInRNqw2_g.ttf'
});

export const AtsPdfDocument = ({ data, language }: { data: any, language: string }) => {
  const isArabic = language === 'Arabic';
  
  const styles = StyleSheet.create({
    page: { 
      padding: 40, 
      fontFamily: isArabic ? 'Cairo' : 'Helvetica', 
      fontSize: 10, 
      color: '#000',
      direction: isArabic ? 'rtl' : 'ltr'
    },
    header: { textAlign: isArabic ? 'right' : 'left', marginBottom: 15 },
    name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    contactInfo: { fontSize: 9, marginBottom: 2 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', borderBottom: '1pt solid #000', paddingBottom: 2, marginBottom: 5, marginTop: 10, textTransform: isArabic ? 'none' : 'uppercase', textAlign: isArabic ? 'right' : 'left' },
    itemContainer: { marginBottom: 8 },
    itemHeader: { flexDirection: isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 2 },
    boldText: { fontWeight: 'bold', fontSize: 10 },
    normalText: { fontSize: 10 },
    bulletRow: { flexDirection: isArabic ? 'row-reverse' : 'row', marginBottom: 3 },
    bulletPoint: { width: 10, fontSize: 10, textAlign: isArabic ? 'left' : 'right', paddingRight: isArabic ? 0 : 4, paddingLeft: isArabic ? 4 : 0 },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.4, textAlign: isArabic ? 'right' : 'left' },
    summaryText: { fontSize: 10, lineHeight: 1.4, marginBottom: 5, textAlign: isArabic ? 'right' : 'left' },
    skillsText: { fontSize: 10, lineHeight: 1.4, textAlign: isArabic ? 'right' : 'left' }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.contact?.name}</Text>
          <Text style={styles.contactInfo}>
            {data.contact?.email} | {data.contact?.phone} | {data.contact?.location}
          </Text>
          <Text style={styles.contactInfo}>{data.contact?.linkedin}</Text>
        </View>

        {data.summary && (
          <View>
            <Text style={styles.sectionTitle}>{isArabic ? 'الملخص المهني' : 'Professional Summary'}</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {data.experience && data.experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{isArabic ? 'الخبرات المهنية' : 'Professional Experience'}</Text>
            {data.experience.map((exp: any, index: number) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.boldText}>{exp.role}</Text>
                  <Text style={styles.normalText}>{exp.period}</Text>
                </View>
                <Text style={{ ...styles.normalText, marginBottom: 3 }}>{exp.organization}</Text>
                {exp.actionBullets?.map((bullet: string, i: number) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.projects && data.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{isArabic ? 'المشاريع التقنية' : 'Technical Projects'}</Text>
            {data.projects.map((proj: any, index: number) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.boldText}>{proj.title}</Text>
                </View>
                {proj.actionBullets?.map((bullet: string, i: number) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{isArabic ? 'المهارات التقنية' : 'Technical Skills'}</Text>
            <Text style={styles.skillsText}>{data.skills.join(isArabic ? ' • ' : ' • ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};