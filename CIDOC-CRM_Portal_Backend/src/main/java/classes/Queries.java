/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashSet;

/**
 *
 * @author theo
 */
public class Queries {

    public String triplesQuery = "SELECT (COUNT(*) AS ?no) { ?s ?p ?o }";
    public String entitiesQuery = "SELECT (COUNT(distinct ?s) AS ?no) { ?s a [] }\n"+ "";

    public String propertiesInfoQuery = "SELECT ?p (COUNT(?s) AS ?count ) { ?s ?p ?o } GROUP BY ?p ORDER BY ?count";

    public String classesInfoQuery = "SELECT ?class (COUNT(?s) AS ?count ) { ?s a ?class } GROUP BY ?class ORDER BY ?count\n" ;

    public int sendQuery(String endpoint, String query) throws UnsupportedEncodingException, MalformedURLException, IOException {
        String sparqlQueryURL = endpoint + "?query=" + URLEncoder.encode(query, "utf8");
        URL url = new URL(sparqlQueryURL);
        URLConnection con = url.openConnection();
        String type = "text/tab-separated-values";
        con.setRequestProperty("ACCEPT", type);

        InputStream is = con.getInputStream();
        InputStreamReader isr = new InputStreamReader(is, "utf8");
        BufferedReader in = new BufferedReader(isr);

        String input;
        String resultsString = "";
        int count = 0;
        while ((input = in.readLine()) != null) {
            resultsString = input.replace("^^http://www.w3.org/2001/XMLSchema#integer", "").replace("\"", "");
            System.out.println(resultsString);
        }

        in.close();
        isr.close();
        is.close();
        return Integer.parseInt(resultsString);

    }

    public HashSet<Property> propertyQueries(String endpoint, String query) throws UnsupportedEncodingException, MalformedURLException, IOException {
        String sparqlQueryURL = endpoint + "?query=" + URLEncoder.encode(query, "utf8");
        URL url = new URL(sparqlQueryURL);
        URLConnection con = url.openConnection();
        String type = "text/tab-separated-values";
        con.setRequestProperty("ACCEPT", type);
        HashSet<Property> properties = new HashSet<Property>();

        InputStream is = con.getInputStream();
        InputStreamReader isr = new InputStreamReader(is, "utf8");
        BufferedReader in = new BufferedReader(isr);

        String input;
        String resultsString = "";
        int count = 0;
        while ((input = in.readLine()) != null) {
            if (count == 0) {
                count = 1;
                continue;
            }
            String[] results = input.split("\t");
            Property p = new Property();
            p.url = results[0];
            p.triples = Integer.parseInt(results[1].replace("^^http://www.w3.org/2001/XMLSchema#integer", "").replace("\"", ""));
            properties.add(p);
        }

        in.close();
        isr.close();
        is.close();
        return properties;
    }

    public HashSet<RDFClass> classQueries(String endpoint, String query) throws UnsupportedEncodingException, MalformedURLException, IOException {
        String sparqlQueryURL = endpoint + "?query=" + URLEncoder.encode(query, "utf8");
        URL url = new URL(sparqlQueryURL);
        URLConnection con = url.openConnection();
        String type = "text/tab-separated-values";
        con.setRequestProperty("ACCEPT", type);
        HashSet<RDFClass> classes = new HashSet<RDFClass>();

        InputStream is = con.getInputStream();
        InputStreamReader isr = new InputStreamReader(is, "utf8");
        BufferedReader in = new BufferedReader(isr);

        String input;
        String resultsString = "";
        int count = 0;
        while ((input = in.readLine()) != null) {
            if (count == 0) {
                count = 1;
                continue;
            }
            String[] results = input.split("\t");
            RDFClass cl = new RDFClass();
            cl.url = results[0];
            cl.triples = Integer.parseInt(results[1].replace("^^http://www.w3.org/2001/XMLSchema#integer", "").replace("\"", ""));
            classes.add(cl);
        }

        in.close();
        isr.close();
        is.close();
        return classes;
    }

}
