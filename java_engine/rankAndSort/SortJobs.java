package rankAndSort;

public class SortJobs {
    
    public void sortJobsByScore(JobListing[] jobs) {
        for (int i = 0; i < jobs.length - 1; i++) {
            int maxIndex = i;

            for (int j = i + 1; j < jobs.length; j++) {
                if (jobs[j].getRankingScore() > jobs[maxIndex].getRankingScore()) {
                    maxIndex = j;
                }
            }

            JobListing temp = jobs[i];
            jobs[i] = jobs[maxIndex];
            jobs[maxIndex] = temp;
        }
    }
}
