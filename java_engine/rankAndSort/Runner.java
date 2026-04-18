package rankAndSort;

import com.google.gson.Gson;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Runner {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder input = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            input.append(line);
        }

        Gson gson = new Gson();
        RankingRequest request = gson.fromJson(input.toString(), RankingRequest.class);

        if (request == null) {
            System.out.println("{\"error\":\"Request was null\"}");
            return;
        }

        SeekerPrefrences seeker = request.getSeeker();
        JobListing[] jobs = request.getJobs();

        if (seeker == null) {
            System.out.println("{\"error\":\"Seeker was null\"}");
            return;
        }

        if (jobs == null) {
            System.out.println("{\"error\":\"Jobs were null\"}");
            return;
        }

        RankJobs ranker = new RankJobs();
        ranker.rankJobs(jobs, seeker);

        SortJobs sorter = new SortJobs();
        sorter.sortJobsByScore(jobs);

        System.out.println(gson.toJson(jobs));
    }
}