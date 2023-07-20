/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package requestClasses;

/**
 *
 * @author Theo
 */
public class RequestGlobal {

    public String searchValue;
    public int limit;
    public int page;
    public int totalEntries = 0;

    public RequestGlobal(String searchValue, int limit, int page) {
        this.searchValue = searchValue;
        this.limit = limit;
        this.page = page;
    }
}
