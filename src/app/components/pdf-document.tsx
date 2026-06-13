import { Document, Page, Text, View, StyleSheet, Font, Link } from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf", fontWeight: "normal" },
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf", fontWeight: "bold" }
  ]
});

const getStyles = (template: string) => StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: "#111111"
  },
  headerContainer: {
    borderBottomWidth: template === 'modern' ? 0 : 1.5,
    borderBottomColor: template === 'executive' ? "#003366" : "#111111",
    paddingBottom: 12,
    marginBottom: 15,
    textAlign: 'center', 
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: template === 'executive' ? "#003366" : "#111111",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center', 
    marginTop: 6,
    fontSize: 9,
    color: "#444444",
    gap: 8
  },
  sectionContainer: {
    marginTop: 14
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: template === 'executive' ? "#003366" : "#111111",
    backgroundColor: template === 'modern' ? "#F4F4F4" : "transparent",
    padding: template === 'modern' ? 4 : 0,
    borderBottomWidth: template === 'modern' ? 0 : 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 3,
    marginBottom: 6,
    letterSpacing: 0.5
  },
  summaryText: {
    fontSize: 9.5,
    lineHeight: 1.4,
    textAlign: "justify"
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: "bold"
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: "#333333",
    fontStyle: "italic"
  },
  entryDate: {
    fontSize: 9.5,
    color: "#555555"
  },
  bulletList: {
    marginLeft: 12,
    marginTop: 3
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 3
  },
  bulletMarker: {
    width: 8,
    fontSize: 9.5
  },
  bulletContent: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.4,
    textAlign: "justify"
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5
  },
  skillBadge: {
    fontSize: 9.5,
    lineHeight: 1.4
  }
});

const isValidString = (str: any) => typeof str === "string" && str.trim() !== "";

export function ATSDocument({ data, template = "classic" }: { data: any, template?: string }) {
  if (!data) return null;
  const styles = getStyles(template);

  // الفلترة الهندسية المستندة حصراً على المخرجات الفعلية للـ API
  const validExperience = data.experience?.filter((exp: any) => isValidString(exp.role) || isValidString(exp.company)) || [];
  const validProjects = data.projects?.filter((proj: any) => isValidString(proj.title) || isValidString(proj.description)) || [];
  const validEducation = data.education?.filter((edu: any) => isValidString(edu.institution) || isValidString(edu.degree)) || [];
  const validCertifications = Array.isArray(data.certifications) ? data.certifications.filter((cert: string) => isValidString(cert)) : [];
  const validSkills = Array.isArray(data.skills) ? data.skills : [];

  return (
    <Document title={`${data.name || "Resume"}_CV`} author={data.name}>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{data.name || "Candidate Name"}</Text>
          <View style={styles.contactRow}>
            {isValidString(data.phone) && <Text>{data.phone}  |</Text>}
            {isValidString(data.email) && <Text>{data.email}  |</Text>}
            {isValidString(data.links) && <Text>{data.links}</Text>}
          </View>
        </View>

        {/* SUMMARY */}
        {isValidString(data.summary) && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* EXPERIENCE */}
        {validExperience.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {validExperience.map((exp: any, index: number) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.role}</Text>
                  <Text style={styles.entryDate}>{exp.period}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}</Text>
                <View style={styles.bulletList}>
                  {(exp.responsibilities || []).map((bullet: string, idx: number) => (
                    bullet.trim() && (
                      <View key={idx} style={styles.bulletPoint}>
                        <Text style={styles.bulletMarker}>•</Text>
                        <Text style={styles.bulletContent}>{bullet.replace(/^•\s*/, "")}</Text>
                      </View>
                    )
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {validProjects.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {validProjects.map((proj: any, index: number) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.title}</Text>
                </View>
                <View style={styles.bulletList}>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bulletMarker}>•</Text>
                    <Text style={styles.bulletContent}>{proj.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {validEducation.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {validEducation.map((edu: any, index: number) => (
              <View key={index} style={{ marginBottom: 4 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution}</Text>
                  <Text style={styles.entryDate}>{edu.period}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{edu.degree}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {validCertifications.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS & COURSES</Text>
            <View style={styles.bulletList}>
              {validCertifications.map((cert: string, index: number) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bulletMarker}>•</Text>
                  <Text style={styles.bulletContent}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SKILLS */}
        {validSkills.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
              <Text style={styles.skillBadge}>
                {validSkills.join(" • ")}
              </Text>
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
}