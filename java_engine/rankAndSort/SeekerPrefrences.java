package rankAndSort;

public class SeekerPrefrences {
    private String desiredJobTitle;
    private String desiredIndustry;
    private String desiredLocation;
    private String educationLevel;
    private String qualifications;
    private String skills;
    private boolean remotePreference;
    private double minPayExpectation;

    public SeekerPrefrences() {
    }

    public SeekerPrefrences(String desiredJobTitle, String desiredIndustry, String desiredLocation,
                            String educationLevel, String qualifications, String skills,
                            boolean remotePreference, double minPayExpectation) {
        this.desiredJobTitle = desiredJobTitle;
        this.desiredIndustry = desiredIndustry;
        this.desiredLocation = desiredLocation;
        this.educationLevel = educationLevel;
        this.qualifications = qualifications;
        this.skills = skills;
        this.remotePreference = remotePreference;
        this.minPayExpectation = minPayExpectation;
    }

    public String getDesiredJobTitle() {
        return desiredJobTitle;
    }

    public String getDesiredIndustry() {
        return desiredIndustry;
    }

    public String getDesiredLocation() {
        return desiredLocation;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public String getQualifications() {
        return qualifications;
    }

    public String getSkills() {
        return skills;
    }

    public boolean isRemotePreference() {
        return remotePreference;
    }

    public double getMinPayExpectation() {
        return minPayExpectation;
    }

    @Override
    public String toString() {
        return "SeekerPrefrences{" +
                "desiredJobTitle='" + desiredJobTitle + '\'' +
                ", desiredIndustry='" + desiredIndustry + '\'' +
                ", desiredLocation='" + desiredLocation + '\'' +
                ", educationLevel='" + educationLevel + '\'' +
                ", qualifications='" + qualifications + '\'' +
                ", skills='" + skills + '\'' +
                ", remotePreference=" + remotePreference +
                ", minPayExpectation=" + minPayExpectation +
                '}';
    }
}