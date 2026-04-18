package rankAndSort;

public class JobListing {
    private String title;
    private String company;
    private String industry;
    private String location;
    private String educationLevel;
    private String qualifications;
    private String requirements;
    private String description;
    private boolean remote;
    private double minPay;
    private double rankingScore;

    public JobListing() {
    }

    public JobListing(String title, String company, String industry, String location,
                      String educationLevel, String qualifications, String requirements,
                      String description, boolean remote, double minPay) {
        this.title = title;
        this.company = company;
        this.industry = industry;
        this.location = location;
        this.educationLevel = educationLevel;
        this.qualifications = qualifications;
        this.requirements = requirements;
        this.description = description;
        this.remote = remote;
        this.minPay = minPay;
    }

    public void setRankingScore(double rankingScore) {
        this.rankingScore = rankingScore;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public String getIndustry() {
        return industry;
    }

    public String getLocation() {
        return location;
    }

    public String getEducationLevel() {
        return educationLevel;
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

    public double getRankingScore() {
        return rankingScore;
    }

    @Override
    public String toString() {
        return "JobListing{" +
                "title='" + title + '\'' +
                ", company='" + company + '\'' +
                ", industry='" + industry + '\'' +
                ", location='" + location + '\'' +
                ", educationLevel='" + educationLevel + '\'' +
                ", qualifications='" + qualifications + '\'' +
                ", requirements='" + requirements + '\'' +
                ", description='" + description + '\'' +
                ", remote=" + remote +
                ", minPay=" + minPay +
                ", rankingScore=" + rankingScore +
                '}';
    }
}