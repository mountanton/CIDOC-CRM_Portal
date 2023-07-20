/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package models;

import java.util.List;

/**
 *
 * @author Theo
 */
public class MostFrequentWithSizeResponse {

    public List<MostFrequentResponse> mostFrequentList;
    public int totalSize;

    public MostFrequentWithSizeResponse(List<MostFrequentResponse> mostFrequentList, int totalSize) {
        this.mostFrequentList = mostFrequentList;
        this.totalSize = totalSize;
    }
}
