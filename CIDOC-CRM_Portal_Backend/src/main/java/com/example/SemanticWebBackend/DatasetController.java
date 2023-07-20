/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SemanticWebBackend;

import classes.Dataset;
import classes.Property;
import requestClasses.RequestDatabase;
import classes.QueriesForWebApp;
import classes.RDFClass;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import models.AutocompleteClassProperty;
import models.AutocompleteClassPropertyLists;
import models.BasicStatistics;
import models.CommonClass;
import models.CommonProperty;
import models.GlobalSearchResponse;
import models.MostFrequentResponse;
import models.MostFrequentWithSizeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import requestClasses.RequestCommon;
import requestClasses.RequestEmail;
import requestClasses.RequestGlobal;
import requestClasses.RequestWithTitle;

/**
 *
 * @author Theo
 */
@RestController
@CrossOrigin
public class DatasetController {

    static List<Dataset> datasets = new ArrayList<>();

    public DatasetController() {
    }

    @GetMapping("/datasets/map")
    public List<Dataset> getAllDatasets() {
        return datasets;
    }

    @GetMapping("/datasets")
    public List<Dataset> getAlldatasets() throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        //get all datasets
        List<Dataset> datasets = new ArrayList<>();
        datasets = queries.retrieveAllDatasetsAndTheirTitle();
        return datasets;
    }

    @PostMapping("/dataset/properties")
    public List<Property> getProperties(@RequestBody RequestDatabase req) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        List<Property> properties = new ArrayList<>();
        properties = queries.getAllProperties(req.endpoint, req.onlyCidoc, req.limit, req.page);
        return properties;
    }

    @PostMapping("/dataset/rdfClasses")
    public List<RDFClass> getClasses(@RequestBody RequestDatabase req) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        List<RDFClass> rdfClasses = new ArrayList<>();
        rdfClasses = queries.getAllClasses(req.endpoint, req.onlyCidoc, req.limit, req.page);
        return rdfClasses;
    }

    @GetMapping("/dataset/basicStatistics")
    public BasicStatistics getBasicStatistics(@RequestParam("dataset") String dataset) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        //get basic statistics
        BasicStatistics basicStatistics;
        basicStatistics = queries.getBasicStatistics(dataset);
        return basicStatistics;
    }

    @PostMapping("/dataset/commonProperties")
    public List<CommonProperty> getCommonProperties(@RequestBody RequestCommon req) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        List<CommonProperty> commonProperties = new ArrayList<>();
        commonProperties = queries.getCommonProperties(req.endpoint1, req.endpoint2, req.onlyCIDOC, req.limit, req.page);
        return commonProperties;
    }

    @PostMapping("/dataset/commonClasses")
    public List<CommonClass> getCommonClasses(@RequestBody RequestCommon req) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        List<CommonClass> commonClasses = new ArrayList<>();
        commonClasses = queries.getCommonClasses(req.endpoint1, req.endpoint2, req.onlyCIDOC, req.limit, req.page);
        return commonClasses;
    }

    @GetMapping("/autocomplete/properties/classes")
    public AutocompleteClassPropertyLists getAutocompleteProperties() throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();

        List<AutocompleteClassProperty> autocompleteProperty;
        List<AutocompleteClassProperty> autocompleteClass;

        autocompleteClass = queries.getAutocompleteClasses();
        autocompleteProperty = queries.getAutocompleteProperties();

        AutocompleteClassPropertyLists autocompleteClassPropertyLists = new AutocompleteClassPropertyLists(autocompleteProperty, autocompleteClass);

        return autocompleteClassPropertyLists;
    }

    @PostMapping("/property/global/search")
    public List<GlobalSearchResponse> propertyGlobalSearch(@RequestBody RequestGlobal req) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        List<GlobalSearchResponse> propertyGlobalSearchResponse = new ArrayList<>();
        propertyGlobalSearchResponse = queries.getPropertyGlobalSearch(req.searchValue, req.limit, req.page);
        return propertyGlobalSearchResponse;
    }

    @PostMapping("/class/global/search")
    public List<GlobalSearchResponse> classGlobalSearch(@RequestBody RequestGlobal req) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        List<GlobalSearchResponse> classGlobalSearchResponse = new ArrayList<>();
        classGlobalSearchResponse = queries.getClassGlobalSearch(req.searchValue, req.limit, req.page);
        return classGlobalSearchResponse;
    }

    @PostMapping("/mostFrequent")
    public MostFrequentWithSizeResponse mostFrequent(@RequestBody RequestWithTitle req) throws IOException {
        QueriesForWebApp queries = new QueriesForWebApp();
        List<MostFrequentResponse> mostFrequestResponse = new ArrayList<>();
        mostFrequestResponse = queries.getMostFrequentWithTitle(req.title, req.limit, req.page);
        int totalSize = 0;
        if (req.totalEntries != 0) {
            totalSize = req.totalEntries;
        } else {
            totalSize = queries.getMostFrequentWithTitleTotalSize(req.title);
        }
        MostFrequentWithSizeResponse mostFrequentWithSizeResponse = new MostFrequentWithSizeResponse(mostFrequestResponse, totalSize);
        return mostFrequentWithSizeResponse;
    }
    @Autowired
    private JavaMailSender javaMailSender;

    @PostMapping("/add/dataset")
    public boolean sendEmail(@RequestBody RequestEmail emailRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailRequest.sendTo);
        message.setSubject(emailRequest.subject);
        message.setText(emailRequest.text);
        javaMailSender.send(message);
        System.out.println("Email Sent Successfully...");

        QueriesForWebApp queries = new QueriesForWebApp();
        boolean jsonAddedToFile = queries.addDatasetToFile(emailRequest.text);
        return jsonAddedToFile;
    }
}

//"http://ldf.fi/ww1lod/sparql" "https://triplydb.com/smithsonian/american-art-museum/sparql/american-art-museum"
