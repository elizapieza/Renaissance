package rankAndSort;

public class JobRequirements {
    private int jobId;
    private String title;
    private String industry;
    private String location;
    private String requiredEducation;
    private String qualifications;
    private String requirements;
    private String description;
    private boolean remote;
    private double minPay;

    public int getJobId() {
        return jobId;
    }

    public String getTitle() {
        return title;
    }

    public String getIndustry() {
        return industry;
    }

    public String getLocation() {
        return location;
    }

    public String getRequiredEducation() {
        return requiredEducation;
    }

    public String getQualifications() {
        return qualifications;
    }

    public String getRequirements() {
        return requirements;
    }

    public String getDescription() {
        return description;
    }

    public boolean isRemote() {
        return remote;
    }

    public double getMinPay() {
        return minPay;
    }
}